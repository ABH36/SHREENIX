// src/models/Review.ts
export const runtime = "nodejs";
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5
    },

    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },

    isApproved: {
      type: Boolean,
      default: true // Auto-approve for now
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    // Optional: Link to order if review is from verified purchase
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes
reviewSchema.index({ isApproved: 1, rating: -1 });
reviewSchema.index({ createdAt: -1 });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);