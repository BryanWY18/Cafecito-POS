import Sell from '../models/sell.js';

async function getSells(req,res,next) {
  try {
    const sells = await Sell.find()
      .populate('customerId')
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(sells);
  } catch (error) {
    next(error);
  }
}

async function getSellById(req, res) {
  try {
    const id = req.params.id;
    const sell = await Sell.findById(id)
      .populate('user')
      .populate('products.productId')
    if (!sell) {
      return res.status(404).json({ message: 'Sell not found' });
    }
    res.json(sell);
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
    const newSale = await Sell.create({
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

export{ getSells, getSellById, createSale};