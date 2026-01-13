import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Client',
  },
  payment
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;