import mongoose from "mongoose";

const sellSchema = new mongoose.Schema({
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
  items:[
    {
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
      },
      quantity:{
        type:Number,
        required:true,
        min:1
      },
      price:{
        type:Number,
        required:true
      }
    }
  ],
},{
  timestamps:true,
}
);

const Sell = mongoose.model('Sell', sellSchema);

export default Sell;