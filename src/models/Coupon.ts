// src/models/Coupon.ts
export const runtime = "nodejs";
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Coupon code cannot exceed 20 characters']
    },

    discountAmount: {
      type: Number,
      required: [true, 'Discount amount is required'],
      min: [0, 'Discount cannot be negative']
    },

    discountType: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed'
    },

    minOrderValue: {
      type: Number,
      default: 0,
      min: [0, 'Minimum order value cannot be negative']
    },

    maxDiscount: {
      type: Number,
      default: null // For percentage-based coupons
    },

    usageLimit: {
      type: Number,
      default: null // null = unlimited
    },

    usedCount: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    validFrom: {
      type: Date,
      default: Date.now
    },

    validUntil: {
      type: Date,
      default: null // null = no expiry
    },

    // Track which users have used this coupon
    usedBy: [
      {
        phone: String,
        usedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });

// Virtual: Check if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  if (!this.validUntil) return false;
  return new Date() > this.validUntil;
});

// Virtual: Check if usage limit reached
couponSchema.virtual('isLimitReached').get(function() {
  if (!this.usageLimit) return false;
  return this.usedCount >= this.usageLimit;
});

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);