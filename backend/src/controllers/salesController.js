import Sale from '../models/sale.js';

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
    const {customerId,paymentMethod,items} = req.body;
    if(!customerId || !paymentMethod || !Array.isArray(items) || items.length===0){
      return res(400).json({error:'Client and products array are required'});
    }
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price || item.quantity < 1) {
        return res.status(400).json({
          error: 'Each product must have productId, quantity >= 1, and price'
        });
      }
    }
    const newSale = await Sale.create({
      customerId,
      paymentMethod,
      items
    });
    await newSale.populate('Client');
    await newSale.populate('items.productId');
    res.status(201).json(newSale);
  }catch(error){
    next(error);
  }
}

export{ getSales, getSaleById, createSale};