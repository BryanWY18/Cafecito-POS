import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    maxlength: 100,
    minlength: 2,
  },
  price:{
    type:Number,
    required:true,
    min:0.01
  },
  stock:{
    type: Number,
    required:true,
    default:0,
    min:0
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;