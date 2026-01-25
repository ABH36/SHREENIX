'use client';

import React, { useEffect, useState } from 'react';
import {
  Save, Loader2, ArrowLeft, Plus, Trash2, MapPin, Image as ImageIcon,
  LayoutDashboard, ShoppingBag, Users, LogOut, Settings, MessageSquare, TicketPercent, Menu, X,
  Upload, Eye, Grid, List, Search, Filter, Check, XCircle, Cloud, ImagePlus
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface CloudinaryImage {
  public_id: string;
  url: string;
  thumbnail: string;
  alt: string;
  type: string;
  size: number;
  format: string;
  uploadedAt: string;
}

interface ProductImage {
  public_id: string;
  url: string;
  thumbnail: string;
  alt: string;
  type: 'hero' | 'treatment' | 'ingredient' | 'gallery' | 'before-after';
  order: number;
  isActive: boolean;
}

const EnhancedProductPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [imageGallery, setImageGallery] = useState<CloudinaryImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadType, setUploadType] = useState<'hero' | 'treatment' | 'gallery'>('hero');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [data, setData] = useState<any>({
    name: { hi: '', en: '' },
    description: { hi: '', en: '' },
    variants: [],
    images: [],
    heroImages: [],
    treatmentImages: [],
    ingredientImages: [],
    galleryImages: [],
    deliveryRules: { allowedStates: [], allowedPincodes: [] },
    topBar: { text: { hi: '', en: '' }, isActive: true, type: 'offer' },
    specifications: {
      quantity: '25gm',
      shelfLife: '24 months',
      manufacturer: 'Shreenix Ayurveda',
      license: 'AYUSH Certified',
      madeIn: 'India',
      ingredients: []
    }
  });

  useEffect(() => {
    fetchProduct();
    fetchGalleryImages();
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

  const fetchGalleryImages = async (type?: string) => {
    try {
      const url = type 
        ? `/api/admin/upload?type=${type}`
        : '/api/admin/upload';
      
      const res = await fetch(url);
      const result = await res.json();
      
      if (result.success) {
        setImageGallery(result.images);
      }
    } catch (error) {
      console.error('Fetch gallery error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      if (result.success) {
        alert('Product updated successfully!');
      } else {
        alert('Update failed: ' + result.error);
      }
    } catch (error) {
      alert('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);
    formData.append('folder', 'shreenix');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      if (result.success) {
        // Add to product images
        const imageRes = await fetch('/api/admin/product/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: result.image,
            type: uploadType
          })
        });

        const imageResult = await imageRes.json();
        if (imageResult.success) {
          setData(imageResult.product);
          fetchGalleryImages();
          alert('Image uploaded and added to product!');
        }
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleSelectImage = (publicId: string) => {
    setSelectedImages(prev =>
      prev.includes(publicId)
        ? prev.filter(id => id !== publicId)
        : [...prev, publicId]
    );
  };

  const handleAddSelectedToProduct = async (type: string) => {
    if (selectedImages.length === 0) return;

    try {
      const selectedImageData = imageGallery.filter(img =>
        selectedImages.includes(img.public_id)
      );

      for (const image of selectedImageData) {
        await fetch('/api/admin/product/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: {
              public_id: image.public_id,
              url: image.url,
              thumbnail: image.thumbnail,
              alt: image.alt
            },
            type
          })
        });
      }

      await fetchProduct();
      setSelectedImages([]);
      alert(`${selectedImages.length} images added to ${type}!`);
    } catch (error) {
      alert('Error adding images');
    }
  };

  const handleRemoveImage = async (publicId: string, type?: string) => {
    if (!confirm('Delete this image from product?')) return;

    try {
      const url = type
        ? `/api/admin/product/images?public_id=${publicId}&type=${type}`
        : `/api/admin/product/images?public_id=${publicId}`;

      const res = await fetch(url, { method: 'DELETE' });
      const result = await res.json();

      if (result.success) {
        setData(result.product);
        alert('Image removed from product!');
      }
    } catch (error) {
      alert('Error removing image');
    }
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const variants = [...data.variants];
    variants[index] = { ...variants[index], [field]: value };
    setData({ ...data, variants });
  };

  const addVariant = () => {
    setData({
      ...data,
      variants: [...data.variants, { 
        weight: 'New Size', 
        price: 0, 
        mrp: 0, 
        inStock: true,
        discount: 0,
        sku: ''
      }]
    });
  };

  const removeVariant = (index: number) => {
    const variants = data.variants.filter((_: any, i: number) => i !== index);
    setData({ ...data, variants });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } catch {
      router.replace('/admin/login');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <h1 className="text-2xl font-serif font-bold text-emerald-900 tracking-tight">
            Shreenix<span className="text-emerald-500">.</span>
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
            { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
            { icon: Users, label: 'Customers', path: '/admin/customers' },
            { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
            { icon: TicketPercent, label: 'Coupons', path: '/admin/coupons' },
            { icon: Settings, label: 'Settings', path: '/admin/settings' }
          ].map(item => (
            <button
              key={item.path}
              onClick={() => { router.push(item.path); setIsMobileNavOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all ${
                pathname === item.path ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );

  const filteredGallery = imageGallery.filter(img =>
    img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)} />
          <div className="relative w-3/4 max-w-xs bg-white h-full shadow-2xl flex flex-col">
            <button onClick={() => setIsMobileNavOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full">
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileNavOpen(true)} className="md:hidden p-2 bg-gray-100 rounded-lg">
              <Menu size={20} className="text-gray-700" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Product Management</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-black transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (<><Save size={16} /> Save Changes</>)}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Product Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery Manager */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Cloud size={20} className="text-blue-600" /> Cloudinary Image Gallery
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchGalleryImages()}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                    >
                      Refresh
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                      >
                        <Grid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Image
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={uploadType}
                          onChange={(e) => setUploadType(e.target.value as any)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="hero">Hero Image</option>
                          <option value="treatment">Treatment Image</option>
                          <option value="gallery">Gallery</option>
                          <option value="ingredient">Ingredient</option>
                        </select>
                        <label className="relative cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                          />
                          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
                            {uploading ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <>
                                <Upload size={16} /> Upload
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Max 5MB • JPG, PNG, WebP
                      </p>
                    </div>

                    {selectedImages.length > 0 && (
                      <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add Selected to:
                        </label>
                        <div className="flex gap-2">
                          <select
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            defaultValue="hero"
                          >
                            <option value="hero">Hero Images</option>
                            <option value="treatment">Treatment Images</option>
                            <option value="gallery">Gallery</option>
                          </select>
                          <button
                            onClick={() => handleAddSelectedToProduct('hero')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                          >
                            Add ({selectedImages.length})
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search images..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Image Grid */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredGallery.map((img) => (
                      <div
                        key={img.public_id}
                        className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedImages.includes(img.public_id)
                            ? 'ring-2 ring-blue-500 border-blue-500'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleSelectImage(img.public_id)}
                      >
                        <div className="aspect-square bg-gray-100 relative">
                          <img
                            src={img.thumbnail}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                          />
                          {selectedImages.includes(img.public_id) && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <Check size={12} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                        <div className="p-2 bg-white">
                          <p className="text-xs font-medium truncate">{img.alt}</p>
                          <p className="text-xs text-gray-500">{img.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredGallery.map((img) => (
                      <div
                        key={img.public_id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedImages.includes(img.public_id)
                            ? 'bg-blue-50 border-blue-500'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectImage(img.public_id)}
                      >
                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                          <img
                            src={img.thumbnail}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{img.alt}</p>
                          <p className="text-xs text-gray-500">{img.type} • {Math.round(img.size / 1024)}KB</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(img.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Variants */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-emerald-600" /> Product Variants
                </h2>
                {data.variants.map((variant: any, index: number) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500">Weight/Size</label>
                        <input
                          type="text"
                          value={variant.weight}
                          onChange={(e) => updateVariant(index, 'weight', e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500">Price (₹)</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500">MRP (₹)</label>
                        <input
                          type="number"
                          value={variant.mrp}
                          onChange={(e) => updateVariant(index, 'mrp', Number(e.target.value))}
                          className="w-full p-2 border rounded-lg line-through text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500">SKU</label>
                        <input
                          type="text"
                          value={variant.sku || ''}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          className="w-full p-2 border rounded-lg text-sm"
                          placeholder="SHX-25GM"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={variant.inStock}
                            onChange={(e) => updateVariant(index, 'inStock', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">In Stock</span>
                        </label>
                      </div>
                      <button
                        onClick={() => removeVariant(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addVariant}
                  className="text-sm font-bold text-emerald-700 hover:underline"
                >
                  + Add Another Variant
                </button>
              </div>
            </div>

            {/* Right Column - Product Images & Settings */}
            <div className="space-y-8">
              {/* Hero Images */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-blue-600" /> Hero Images
                </h2>
                <div className="space-y-3">
                  {data.heroImages && data.heroImages.length > 0 ? (
                    data.heroImages.map((img: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                          <img
                            src={img.thumbnail || img.url}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{img.alt}</p>
                          <p className="text-xs text-gray-500">Hero Image #{index + 1}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveImage(img.public_id, 'hero')}
                          className="text-red-400 hover:text-red-600"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No hero images added yet
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAddSelectedToProduct('hero')}
                  className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm font-medium hover:bg-blue-100"
                >
                  <ImagePlus size={16} className="inline mr-2" />
                  Add Selected as Hero Images
                </button>
              </div>

              {/* Treatment Images */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-purple-600" /> Treatment Images
                </h2>
                <div className="space-y-3">
                  {data.treatmentImages && data.treatmentImages.length > 0 ? (
                    data.treatmentImages.map((img: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                          <img
                            src={img.thumbnail || img.url}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{img.alt}</p>
                          <p className="text-xs text-gray-500">Treatment #{index + 1}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveImage(img.public_id, 'treatment')}
                          className="text-red-400 hover:text-red-600"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No treatment images added yet
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAddSelectedToProduct('treatment')}
                  className="w-full mt-4 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 text-sm font-medium hover:bg-purple-100"
                >
                  <ImagePlus size={16} className="inline mr-2" />
                  Add Selected as Treatment Images
                </button>
              </div>

              {/* Delivery Settings */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-emerald-600" /> Delivery Settings
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Allowed Pincodes
                    </label>
                    <textarea
                      value={data.deliveryRules?.allowedPincodes?.join(', ') || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          deliveryRules: {
                            ...data.deliveryRules,
                            allowedPincodes: e.target.value.split(',').map((s) => s.trim())
                          }
                        })
                      }
                      placeholder="452001, 452002, 452003"
                      className="w-full p-3 border rounded-lg text-sm"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Comma separated pincodes
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      value={data.deliveryRules?.deliveryTime || '2-4 days'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          deliveryRules: {
                            ...data.deliveryRules,
                            deliveryTime: e.target.value
                          }
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnhancedProductPage;