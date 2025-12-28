export const runtime = "nodejs";
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      default: 'India',
      trim: true
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.models.Review ||
  mongoose.model('Review', reviewSchema);
