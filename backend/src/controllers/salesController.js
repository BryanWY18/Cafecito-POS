import Sale from '../models/sale.js';
import SaleItem from '../models/saleItem.js';

async function getSales(req,res,next) {
  try {
    const Sales = await Sale.find()
      .populate('customerId')
      .sort({ createdAt: -1 });
    res.json(Sales);
  } catch (error) {
    next(error);
  }
}

async function getSaleById(req, res) {
  try {
    const id = req.params.id;
    const Sale = await Sale.findById(id)
      .populate('Client')
    if (!Sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(Sale);
  } catch (error) {
    next(error);
  }
}

async function createSale(req,res,next) {
  try{
    const {customerId,paymentMethod,items, discountPercent=0} = req.body;

    if( !paymentMethod || !Array.isArray(items) || items.length===0){
      return res.status(400).json({error:'Payment and products array are required'});
    }
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.unitPrice || item.quantity < 1) {
        return res.status(400).json({
          error: 'Each product must have productId, quantity >= 1, and unitPrice'
        });
      }
    }
    const subTotal = items.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);
    const discountAmount = (subTotal * discountPercent) / 100;
    const total = subTotal - discountAmount;
    const newSale = await Sale.create({
      customerId: customerId || null,
      paymentMethod,
      subTotal,
      discountPercent,
      discountAmount,
      total
    });

    // Se crea y hace la operación de los items de venta:
    const saleItems = await Promise.all(
      items.map(item => 
        SaleItem.create({
          saleId: newSale._id,
          productId: item.productId,
          productNameSnapshot: item.productName,
          unitPriceSnapshot: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.unitPrice * item.quantity
        })
      )
    );
    await newSale.populate('customerId');
    res.status(201).json({
      sale: newSale,
      items: saleItems
    });
  }catch(error){
    next(error);
  }
}

export{ getSales, getSaleById, createSale};