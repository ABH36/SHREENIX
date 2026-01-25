// src/app/admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Save, Loader2, Plus, Trash2, MapPin, Image as ImageIcon,
  Package, DollarSign, AlertCircle, CheckCircle
} from 'lucide-react';
import ImageUpload from '../../admin/ImageUpload';

interface Variant {
  weight: string;
  price: number;
  mrp: number;
  image: string;
  imagePublicId?: string;
  inStock: boolean;
}

interface ImageData {
  url: string;
  publicId?: string;
  order: number;
}

interface ProductData {
  name: string;
  variants: Variant[];
  deliveryRules: {
    allowedStates: string[];
    allowedPincodes: string[];
  };
  heroImages: ImageData[];
  treatmentImages: ImageData[];
  topBar: {
    text: string;
    isActive: boolean;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export default function ProductPage() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [data, setData] = useState<ProductData>({
    name: '',
    variants: [],
    deliveryRules: { allowedStates: [], allowedPincodes: [] },
    heroImages: [],
    treatmentImages: [],
    topBar: { text: '', isActive: true },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch('/api/admin/product');
      const result = await res.json();
      if (result.success && result.product) {
        setData(result.product);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        alert(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...data.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setData({ ...data, variants: newVariants });
  };

  const addVariant = () => {
    setData({
      ...data,
      variants: [
        ...data.variants,
        { weight: 'New Size', price: 0, mrp: 0, image: '', inStock: true }
      ]
    });
  };

  const removeVariant = (index: number) => {
    const newVariants = data.variants.filter((_, i) => i !== index);
    setData({ ...data, variants: newVariants });
  };

  const handleHeroImagesUpdate = (urls: string[]) => {
    const newImages = urls.map((url, index) => ({
      url,
      publicId: '', // Will be populated by upload component
      order: index
    }));
    setData({ ...data, heroImages: newImages });
  };

  const handleTreatmentImagesUpdate = (urls: string[]) => {
    const newImages = urls.map((url, index) => ({
      url,
      publicId: '',
      order: index
    }));
    setData({ ...data, treatmentImages: newImages });
  };

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product variants, images, and delivery settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`
            px-6 py-3 rounded-lg font-semibold text-white
            flex items-center gap-2 transition-all shadow-lg
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}
            ${saveStatus === 'success' ? 'bg-green-500' : ''}
            ${saveStatus === 'error' ? 'bg-red-500' : ''}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <CheckCircle size={20} />
              Saved!
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Product Variants Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Package className="text-emerald-700" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Product Variants</h2>
              <p className="text-sm text-gray-500">Add different sizes and pricing options</p>
            </div>
          </div>
          <button
            onClick={addVariant}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-semibold"
          >
            <Plus size={20} />
            Add Variant
          </button>
        </div>

        {data.variants.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-2">No variants added yet</p>
            <p className="text-sm text-gray-400">Click "Add Variant" to create your first product variant</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative"
              >
                {/* Weight */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Weight/Size
                  </label>
                  <input
                    type="text"
                    value={variant.weight}
                    onChange={(e) => updateVariant(index, 'weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., 50g"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Selling Price (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="499"
                    />
                  </div>
                </div>

                {/* MRP */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    MRP (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={variant.mrp}
                      onChange={(e) => updateVariant(index, 'mrp', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="999"
                    />
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={variant.inStock}
                      onChange={(e) => updateVariant(index, 'inStock', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock</span>
                  </label>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeVariant(index)}
                  className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove variant"
                >
                  <Trash2 size={18} />
                </button>

                {/* Discount Badge */}
                {variant.mrp > variant.price && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded">
                    {Math.round(((variant.mrp - variant.price) / variant.mrp) * 100)}% OFF
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hero Images Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ImageIcon className="text-blue-700" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hero Slider Images</h2>
            <p className="text-sm text-gray-500">Main product images for homepage slider</p>
          </div>
        </div>

        <ImageUpload
          folder="shreenix/hero"
          maxFiles={5}
          currentImages={data.heroImages.map(img => img.url)}
          onUploadComplete={handleHeroImagesUpdate}
        />
      </div>

      {/* Treatment Images Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ImageIcon className="text-purple-700" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Treatment Images</h2>
            <p className="text-sm text-gray-500">Before/After or product usage images</p>
          </div>
        </div>

        <ImageUpload
          folder="shreenix/treatment"
          maxFiles={10}
          currentImages={data.treatmentImages.map(img => img.url)}
          onUploadComplete={handleTreatmentImagesUpdate}
        />
      </div>

      {/* Delivery Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <MapPin className="text-emerald-700" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Delivery Zones</h2>
            <p className="text-sm text-gray-500">Manage serviceable pincodes</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Allowed Pincodes (Comma Separated)
            </label>
            <textarea
              value={data.deliveryRules.allowedPincodes.join(', ')}
              onChange={(e) =>
                setData({
                  ...data,
                  deliveryRules: {
                    ...data.deliveryRules,
                    allowedPincodes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                })
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
              placeholder="452001, 452002, 452003..."
            />
            <p className="text-xs text-gray-500 mt-2">
              <AlertCircle className="inline mr-1" size={14} />
              Enter pincodes separated by commas. Leave empty to allow all pincodes.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">SEO Settings</h2>
          <p className="text-sm text-gray-500">Optimize for search engines</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={data.seo?.metaTitle || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  seo: { ...data.seo!, metaTitle: e.target.value }
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Shreenix Ayurveda – Trusted Ayurvedic Fungal Care"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={data.seo?.metaDescription || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  seo: { ...data.seo!, metaDescription: e.target.value }
                })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Clinically inspired Ayurvedic cream for fungal infection..."
            />
          </div>
        </div>
      </div>

      {/* Save Button (Mobile) */}
      <div className="md:hidden">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full px-6 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Saving...
            </>
          ) : (
            <>
              <Save size={24} />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}