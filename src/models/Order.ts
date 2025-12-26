import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true }
    },

    orderItems: [
      {
        name: { type: String, required: true, trim: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        }
      }
    ],

    paymentMethod: { type: String, required: true, trim: true },

    paymentResult: {
      id: { type: String },
      status: { type: String },
      email_address: { type: String, lowercase: true, trim: true }
    },

    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },

    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },

    whatsappSent: { type: Boolean, default: false },
    reviewRequestSent: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
