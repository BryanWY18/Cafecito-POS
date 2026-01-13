import mongoose from "mongoose"

const saleItem = new mongoose.Schema({
  saleId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Sell',
  },
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:true,
  },
  productNameSnapshot:{
    type:string,
    required:true,
  },
  unitPriceSnapshot:{
    type:Number,
    required:true,
  },
  quantity:{
    type:Number,
    required:true,
    min:1
  },
  lineTotal:{
    type:Number,
    required:true,
  },
});

const SaleItem = mongoose.model('SaleItem', saleItem);

export default SaleItem;
