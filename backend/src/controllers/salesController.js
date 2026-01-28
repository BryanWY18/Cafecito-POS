import Sale from '../models/sale.js';
import SaleItem from '../models/saleItem.js';
import Product from '../models/product.js';
import Client from '../models/client.js';

async function getSales(req,res,next) {
  try {
    const Sales = await Sale.find()
      .populate('customerId')
      .sort({ createdAt: -1 });
    res.json(Sales);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getSaleById(req, res) {
  try { 
    const id = req.params.id;
    const sale = await Sale.findById(id).populate('customerId')
    if (!sale) {
      return res.status(404).json({error:'Sale not found', id:`${id}` });
    }
    const ticket = generateTicket(sale, sale.items);
    res.json({
      saleId: sale._id,
      customerId: sale.customerId,
      paymentMethod: sale.paymentMethod,
      items: sale.items,
      subtotal: sale.subTotal,
      discountPercent: sale.discountPercent,
      discountAmount: sale.discountAmount,
      total: sale.total,
      ticket,
      createdAt: sale.createdAt
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

function generateTicket(sale, enrichedItems) {
  return {
    saleId: sale._id,
    timestamp: sale.createdAt,
    storeName: "Cafecito Feliz",
    items: enrichedItems.map(item => ({
      name: item.productName,
      qty: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal
    })),
    subtotal: sale.subTotal,
    discount: sale.discountPercent > 0 
      ? `${sale.discountPercent}% (-$${sale.discountAmount.toFixed(2)})` 
      : "0%",
    total: sale.total,
    paymentMethod: sale.paymentMethod
  };
}

async function createSaleItems(saleId, enrichedItems) {
  return await SaleItem.insertMany(
    enrichedItems.map(item => ({
      saleId,
      productId: item.productId,
      productNameSnapshot: item.productName,
      unitPriceSnapshot: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal
    }))
  );
}

async function createSale(req, res, next) {
  try {
    const { customerId, paymentMethod , items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(422).json({error:'Payment and products array are required'});;
    }

    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== items.length) {
      return res.status(422).json({error:'One or more products do not exist'});
    }

    // Crear mapa de productos
    const productMap = new Map(products.map(p => [p._id.toString(), p]));
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
      return res.status(422).json({
        error: 'Insufficient stock',
        stockErrors
      });
    }

    let discountPercent = 0;
    let customer = null;
    if (customerId) {
      customer = await Client.findById(customerId);
      if (customer && customer.purchasesCount > 0) {
        if (customer.purchasesCount <= 3) discountPercent = 5;
        else if (customer.purchasesCount <= 7) discountPercent = 10;
        else discountPercent = 15;
      }
    }
    const enrichedItems = items.map(item => {
      const product = productMap.get(item.productId);
      return {
        productId: item.productId,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity
      };
    });

    const subtotal = enrichedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;

    const newSale = await Sale.create({
      customerId: customerId || null,
      paymentMethod,
      items: enrichedItems,
      subTotal: subtotal,
      discountPercent,
      discountAmount,
      total
    });

    await createSaleItems(newSale._id, enrichedItems);

    await Promise.all([
      ...items.map(item =>
        Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
      ),
      customerId && customer
        ? Client.findByIdAndUpdate(customerId, { $inc: { purchasesCount: 1 } })
        : Promise.resolve()
    ]);

    const ticket = generateTicket(newSale, enrichedItems);

    // Respuesta final
    res.status(201).json({
      saleId: newSale._id,
      customerId: newSale.customerId,
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