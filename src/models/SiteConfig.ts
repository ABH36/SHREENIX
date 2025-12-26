import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      default: '9630703732',
      trim: true
    },
    email: {
      type: String,
      default: 'shreenix.care@gmail.com',
      lowercase: true,
      trim: true
    },
    address: {
      type: String,
      default: 'Indore, Madhya Pradesh, India',
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.models.SiteConfig ||
  mongoose.model('SiteConfig', siteConfigSchema);
