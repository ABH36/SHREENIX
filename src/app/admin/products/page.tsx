'use client';

import React, { useEffect, useState } from 'react';
import {
  Save, Loader2, ArrowLeft, Plus, Trash2, MapPin, Image as ImageIcon,
  LayoutDashboard, ShoppingBag, Users, LogOut, Settings, MessageSquare, TicketPercent, Menu, X
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const ProductPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [data, setData] = useState<any>({
    variants: [],
    deliveryRules: { allowedStates: [], allowedPincodes: [] },
    heroImages: [],
    treatmentImages: []
  });

  useEffect(() => {
    fetch('/api/admin/product')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.product) {
          setData({
            ...res.product,
            variants: res.product.variants || [],
            deliveryRules: res.product.deliveryRules || { allowedStates: [], allowedPincodes: [] },
            heroImages: res.product.heroImages || [],
            treatmentImages: res.product.treatmentImages || []
          });
        }
      })
      .catch(() => console.log('Fetch error'));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await fetch('/api/admin/product', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setLoading(false);
    alert('Settings Updated Successfully!');
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

  const handleArrayChange = (key: string, index: number, val: string) => {
    const list = data[key] ? [...data[key]] : [];
    list[index] = val;
    setData({ ...data, [key]: list });
  };

  const updateVariant = (index: number, field: string, val: any) => {
    const vars = [...(data.variants || [])];
    vars[index] = { ...vars[index], [field]: val };
    setData({ ...data, variants: vars });
  };

  const addVariant = () => {
    setData({
      ...data,
      variants: [...(data.variants || []), { weight: 'New Size', price: 0, mrp: 0, inStock: true }]
    });
  };

  const removeVariant = (index: number) => {
    const vars = (data.variants || []).filter((_: any, i: number) => i !== index);
    setData({ ...data, variants: vars });
  };

  const addImageSlot = (key: string) => setData({ ...data, [key]: [...(data[key] || []), ''] });

  const removeImageSlot = (key: string, index: number) => {
    const list = (data[key] || []).filter((_: any, i: number) => i !== index);
    setData({ ...data, [key]: list });
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
            { icon: ShoppingBag, label: 'Products (Price)', path: '/admin/products' },
            { icon: Users, label: 'Customers', path: '/admin/customers' },
            { icon: MessageSquare, label: 'Manage Reviews', path: '/admin/reviews' },
            { icon: TicketPercent, label: 'Coupons', path: '/admin/coupons' },
            { icon: Settings, label: 'Website Settings', path: '/admin/settings' }
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
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Product Settings</h1>
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
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-emerald-600" /> Product Variants
              </h2>

              {(data.variants || []).map((v: any, i: number) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 items-end mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                  <div className="w-full md:w-1/4">
                    <label className="text-xs font-bold text-gray-500">Weight/Size</label>
                    <input type="text" value={v.weight} onChange={e => updateVariant(i, 'weight', e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="text-xs font-bold text-gray-500">Price (₹)</label>
                    <input type="number" value={v.price} onChange={e => updateVariant(i, 'price', Number(e.target.value))} className="w-full p-2 border rounded-lg text-emerald-700 font-bold" />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="text-xs font-bold text-gray-500">MRP (₹)</label>
                    <input type="number" value={v.mrp} onChange={e => updateVariant(i, 'mrp', Number(e.target.value))} className="w-full p-2 border rounded-lg text-gray-400 line-through" />
                  </div>
                  <button onClick={() => removeVariant(i)} className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-2 text-red-500 hover:bg-red-100 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button onClick={addVariant} className="text-sm font-bold text-emerald-700 hover:underline">+ Add Another Size</button>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-600" /> Website Images
              </h2>

              <div className="mb-6">
                <label className="text-sm font-bold text-gray-600 block mb-2">Hero Slider Images</label>
                {(data.heroImages || []).map((url: string, i: number) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={url} onChange={e => handleArrayChange('heroImages', i, e.target.value)} className="w-full p-2 border rounded-lg text-xs" />
                    <button onClick={() => removeImageSlot('heroImages', i)} className="text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => addImageSlot('heroImages')} className="text-xs text-blue-600 font-bold">+ Add Image URL</button>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 block mb-2">Treatment Images</label>
                {(data.treatmentImages || []).map((url: string, i: number) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={url} onChange={e => handleArrayChange('treatmentImages', i, e.target.value)} className="w-full p-2 border rounded-lg text-xs" />
                    <button onClick={() => removeImageSlot('treatmentImages', i)} className="text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => addImageSlot('treatmentImages')} className="text-xs text-blue-600 font-bold">+ Add Image URL</button>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border-2 border-emerald-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-emerald-600" /> Delivery Whitelist
              </h2>

              <label className="text-sm font-bold text-gray-600 block mb-2">Allowed Pincodes (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g., 452001, 452002"
                value={data.deliveryRules?.allowedPincodes?.join(', ') || ''}
                onChange={e =>
                  setData({
                    ...data,
                    deliveryRules: {
                      ...data.deliveryRules,
                      allowedPincodes: e.target.value.split(',').map((s: string) => s.trim())
                    }
                  })
                }
                className="w-full p-3 border rounded-xl font-mono text-emerald-800"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-black transition-all flex justify-center items-center gap-2 md:hidden"
            >
              {loading ? <Loader2 className="animate-spin" /> : (<><Save /> Save All Changes</>)}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
