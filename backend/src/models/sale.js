import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  customerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    default:null,
  },
  paymentMethod:{
    type: String,
    required: true,
    enum: ['cash', 'card', 'transfer'],
    default: 'cash'
  },
  subTotal:{
    type: Number,
    required:true,
  },
  discountPercent:{
    type: Number,
    default: 0
  },
  discountAmount:{
    type:Number,
    default: 0
  },
  total:{
    type: Number,
    required:true,
  },
},{
  timestamps:true,
}
);

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;