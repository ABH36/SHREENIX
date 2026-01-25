// src/models/Settings.ts
export const runtime = "nodejs";
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    // Contact Information
    phone: {
      type: String,
      required: true,
      default: '9630703732'
    },

    email: {
      type: String,
      required: true,
      default: 'shreenix.care@gmail.com'
    },

    address: {
      type: String,
      required: true,
      default: 'Indore, Madhya Pradesh'
    },

    // Social Media Links
    socialLinks: {
      facebook: {
        type: String,
        default: ''
      },
      instagram: {
        type: String,
        default: ''
      },
      twitter: {
        type: String,
        default: ''
      },
      youtube: {
        type: String,
        default: ''
      }
    },

    // Business Hours
    businessHours: {
      type: String,
      default: 'Mon-Sat: 9:00 AM - 6:00 PM'
    },

    // WhatsApp Support
    whatsappNumber: {
      type: String,
      default: '9630703732'
    },

    // SEO Settings
    defaultSEO: {
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
        default: ['ayurvedic cream', 'fungal infection', 'ringworm treatment', 'skin care']
      }
    },

    // Analytics
    googleAnalyticsId: {
      type: String,
      default: ''
    },

    facebookPixelId: {
      type: String,
      default: ''
    },

    // Maintenance Mode
    maintenanceMode: {
      enabled: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: 'We are currently under maintenance. Please check back soon.'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);