import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  phoneOrEmail: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(value) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        const phoneRegex = /^\+\d{10,15}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      message: 'Debe ser un email válido o un teléfono con formato +1234567890'
    }
  },
  purchasesCount:{
    type:Number,
    default:0
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Client = mongoose.model('Client', clientSchema);

export default Client;