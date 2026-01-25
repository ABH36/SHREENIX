// src/models/Order.ts
export const runtime = "nodejs";
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        trim: true,
        match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
      }
    },

    orderItems: [
      {
        name: {
          type: String,
          required: true
        },
        qty: {
          type: Number,
          required: true,
          default: 1,
          min: 1
        },
        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },

    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'Prepaid', 'Online'],
      default: 'COD'
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },

    // Coupon details if applied
    couponApplied: {
      code: {
        type: String,
        default: null
      },
      discountAmount: {
        type: Number,
        default: 0
      }
    },

    // Admin notes
    notes: {
      type: String,
      default: ''
    },

    // Tracking information
    trackingId: {
      type: String,
      default: null
    },

    // IP address for fraud detection
    ipAddress: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes for better query performance
orderSchema.index({ 'customerDetails.phone': 1 });
orderSchema.index({ 'customerDetails.pincode': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);