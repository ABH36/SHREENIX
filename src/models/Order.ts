import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true }, // WhatsApp number
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
  paymentMethod: { type: String, required: true }, // 'UPI', 'COD'
  paymentResult: {
    id: { type: String },
    status: { type: String },
    email_address: { type: String },
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  
  // --- Productivity & Automation Fields (As per SRS) ---
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
  
  // Status Management for Admin & User Tracking
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  
  // Automation Flags (To prevent duplicate messages)
  whatsappSent: { type: Boolean, default: false }, // Order confirmation sent?
  reviewRequestSent: { type: Boolean, default: false }, // Review email/msg sent?

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Check if model already exists to prevent overwrite error in Next.js
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;