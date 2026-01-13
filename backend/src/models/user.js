import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  displayName:{
    type:String,
    required:true
  },
  hashPassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },  
  role: {
    type: String,
    required: true,
    enum: ['admin', 'seller'],
    default: 'seller'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;