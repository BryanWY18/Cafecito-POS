import Sale from '../models/sale.js';
import SaleItem from '../models/saleItem.js';
import Product from '../models/product.js';
import Client from '../models/client.js';

async function getSales(req,res,next) {
  try {
    const Sales = await Sale.find()
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(Sales);
  } catch (error) {
    next(error);
  }
}

async function getSaleById(req, res) {
  try { 
    const id = req.params.id;
    const sale = await Sale.findById(id).populate('items')
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    next(error);
  }
}

async function createSale(req, res, next) {
  try {
    const { clientId, paymentMethod, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({error:'Payment and products array are required'})
    }

    // Validar estructura de cada item
    const validationErrors = [];
    items.forEach((item, index) => {
      if (!item.productId) {
        validationErrors.push({
          field: `items[${index}].productId`,
          message: 'productId is required'
        });
      }
      if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity < 1) {
        validationErrors.push({
          field: `items[${index}].quantity`,
          message: 'quantity must be >= 1'
        });
      }
    });

    if (validationErrors.length > 0) {
      return res.status(422).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // ========== OBTENER PRODUCTOS DE LA DB ==========
    
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Validar que todos los productos existan
    if (products.length !== items.length) {
      const foundIds = products.map(p => p._id.toString());
      const missingIds = productIds.filter(id => !foundIds.includes(id));
      
      return res.status(422).json({
        error: 'Validation failed',
        details: missingIds.map(id => ({
          field: 'productId',
          message: `Product ${id} does not exist`
        }))
      });
    }

    // Crear mapa de productos
    const productMap = new Map(
      products.map(p => [p._id.toString(), p])
    );

    // ========== VALIDAR STOCK ==========
    
    const stockErrors = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (product.stock < item.quantity) {
        stockErrors.push({
          productId: item.productId,
          message: `Only ${product.stock} available, requested ${item.quantity}`
        });
      }
    }

    if (stockErrors.length > 0) {
      return res.status(400).json({
        error: 'Insufficient stock',
        details: stockErrors
      });
    }

    // ========== CALCULAR DESCUENTO AUTOMÁTICO ==========
    
    let discountPercent = 0;
    let Client = null;

    if (clientId) {
      Client = await Client.findById(clientId);
      
      if (Client && Client.purchasesCount > 0) {
        if (Client.purchasesCount >= 1 && Client.purchasesCount <= 3) {
          discountPercent = 5;
        } else if (Client.purchasesCount >= 4 && Client.purchasesCount <= 7) {
          discountPercent = 10;
        } else if (Client.purchasesCount >= 8) {
          discountPercent = 15;
        }
      }
    }

    // ========== ENRIQUECER ITEMS Y CALCULAR TOTALES ==========
    
    const enrichedItems = items.map(item => {
      const product = productMap.get(item.productId);
      const lineTotal = product.price * item.quantity;
      
      return {
        productId: item.productId,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal
      };
    });

    const subtotal = enrichedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;

    // ========== CREAR VENTA ==========
    
    const newSale = await Sale.create({
      ClientId: ClientId || null,
      paymentMethod,
      items: enrichedItems,
      subTotal: subtotal,
      discountPercent,
      discountAmount,
      total
    });

    // ========== CREAR SALE ITEMS ==========
    
    const saleItems = await SaleItem.insertMany(
      enrichedItems.map(item => ({
        saleId: newSale._id,
        productId: item.productId,
        productNameSnapshot: item.productName,
        unitPriceSnapshot: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal
      }))
    );

    // ========== ACTUALIZAR STOCK DE PRODUCTOS ==========
    
    await Promise.all(
      items.map(item =>
        Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        )
      )
    );

    // ========== INCREMENTAR CONTADOR DE COMPRAS DEL CLIENTE ==========
    
    if (ClientId && Client) {
      await Client.findByIdAndUpdate(
        ClientId,
        { $inc: { purchasesCount: 1 } }
      );
    }

    // ========== GENERAR TICKET ==========
    
    const ticket = {
      saleId: newSale._id,
      timestamp: newSale.createdAt,
      storeName: "Cafecito Feliz", // Puedes hacer esto configurable
      items: enrichedItems.map(item => ({
        name: item.productName,
        qty: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      })),
      subtotal,
      discount: discountPercent > 0 ? `${discountPercent}% (-$${discountAmount.toFixed(2)})` : "0%",
      total,
      paymentMethod
    };

    // ========== RESPUESTA ==========
    
    res.status(201).json({
      saleId: newSale._id,
      ClientId: newSale.ClientId,
      paymentMethod: newSale.paymentMethod,
      items: enrichedItems,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      ticket,
      createdAt: newSale.createdAt
    });

  } catch (error) {
    console.error('Error creating sale:', error);
    next(error);
  }
}

export{ getSales, getSaleById, createSale};