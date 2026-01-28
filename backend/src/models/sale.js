import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    default: null,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'transfer'],
    default: 'cash'
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      unitPrice: {
        type: Number,
        required: true
      },
      lineTotal: {
        type: Number,
        required: true
      }
    }
  ],
  subTotal: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
  },
  ticket: {
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    storeName: {
      type: String,
      default: "Cafecito Feliz"
    },
    items: [
      {
        name: {
          type: String
        },
        qty: {
          type: Number
        },
        unitPrice: {
          type: Number
        },
        lineTotal: {
          type: Number
        },
      }
    ]
  },
}, {
  timestamps: true,
});

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;