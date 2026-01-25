// src/models/Product.ts
export const runtime = "nodejs";
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Shreenix Ayurveda',
      trim: true
    },

    variants: [
      {
        weight: {
          type: String,
          required: true,
          trim: true
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
        mrp: {
          type: Number,
          required: true,
          min: 0
        },
        image: {
          type: String,
          default: '/hero-product.png'
        },
        // Cloudinary public ID for easy deletion
        imagePublicId: {
          type: String,
          default: null
        },
        inStock: {
          type: Boolean,
          default: true
        }
      }
    ],

    deliveryRules: {
      allowedStates: {
        type: [String],
        default: []
      },
      allowedPincodes: {
        type: [String],
        default: []
      }
    },

    // Hero Images with Cloudinary support
    heroImages: [
      {
        url: {
          type: String,
          required: true
        },
        publicId: {
          type: String,
          default: null
        },
        order: {
          type: Number,
          default: 0
        }
      }
    ],

    // Treatment Images with Cloudinary support
    treatmentImages: [
      {
        url: {
          type: String,
          required: true
        },
        publicId: {
          type: String,
          default: null
        },
        order: {
          type: Number,
          default: 0
        }
      }
    ],

    topBar: {
      text: {
        type: String,
        default: '🎉 Free Delivery on Prepaid Orders!',
        trim: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    },

    // SEO Fields
    seo: {
      metaTitle: {
        type: String,
        default: 'Shreenix Ayurveda – Trusted Ayurvedic Fungal Care'
      },
      metaDescription: {
        type: String,
        default: 'Clinically inspired Ayurvedic cream for fungal infection, itching, rashes & ringworm. Fast relief, safe and natural.'
      },
      keywords: {
        type: [String],
        default: ['ayurvedic cream', 'fungal infection', 'ringworm treatment']
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.models.Product ||
  mongoose.model('Product', productSchema);