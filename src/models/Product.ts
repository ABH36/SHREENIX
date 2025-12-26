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

    heroImages: {
      type: [String],
      default: ['/hero-product.png']
    },

    treatmentImages: {
      type: [String],
      default: ['/problem-1.png', '/problem-2.png', '/problem-3.png']
    },

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
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.models.Product ||
  mongoose.model('Product', productSchema);
