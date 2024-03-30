const mongoose = require('mongoose');

const SingleOrderItemSchema = mongoose.Schema({


  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Boat',
    required: true,
  },
});


const OrderSchema = mongoose.Schema(
    {

      subtotal: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      orderItems: [SingleOrderItemSchema],
      status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        default: 'pending',
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      clientSecret: {
        type: String,
        required: true,
      },
      paymentIntentId: {
        type: String,
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Order', OrderSchema);


