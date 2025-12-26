'use client';
import React, { useEffect, useState } from 'react';
import { Save, Loader2, ArrowLeft, Plus, Trash2, MapPin, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Initial State me empty arrays rakhe hain
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
          if(res.success && res.product) {
              // SAFETY FIX: Agar database me ye fields nahi hain, to empty array lo
              setData({
                  ...res.product,
                  variants: res.product.variants || [],
                  deliveryRules: res.product.deliveryRules || { allowedStates: [], allowedPincodes: [] },
                  heroImages: res.product.heroImages || [],
                  treatmentImages: res.product.treatmentImages || []
              });
          }
      })
      .catch(err => console.log("Data fetch error"));
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

  const handleArrayChange = (key: string, index: number, val: string) => {
    // Safety check
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
    const vars = (data.variants || []).filter((_:any, i:number) => i !== index);
    setData({ ...data, variants: vars });
  };

  // Helper to add new empty slot for images
  const addImageSlot = (key: string) => {
      setData({ ...data, [key]: [...(data[key] || []), ''] });
  };
  
  const removeImageSlot = (key: string, index: number) => {
      const list = (data[key] || []).filter((_:any, i:number) => i !== index);
      setData({ ...data, [key]: list });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
             <button onClick={() => router.push('/admin/dashboard')} className="flex items-center text-gray-500 hover:text-emerald-700">
                <ArrowLeft size={18} className="mr-2" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Master Product Control</h1>
        </div>

        {/* 1. VARIANTS CONTROL */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus size={20} className="text-emerald-600"/> Product Variants</h2>
            
            {/* SAFETY FIX: (data.variants || []) */}
            {(data.variants || []).map((v: any, i: number) => (
                <div key={i} className="flex flex-wrap md:flex-nowrap gap-4 items-end mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-full md:w-1/4">
                        <label className="text-xs font-bold text-gray-500">Weight/Size</label>
                        <input type="text" value={v.weight} onChange={(e)=>updateVariant(i, 'weight', e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                    </div>
                    <div className="w-1/2 md:w-1/4">
                        <label className="text-xs font-bold text-gray-500">Price (₹)</label>
                        <input type="number" value={v.price} onChange={(e)=>updateVariant(i, 'price', Number(e.target.value))} className="w-full p-2 border rounded-lg text-emerald-700 font-bold" />
                    </div>
                    <div className="w-1/2 md:w-1/4">
                        <label className="text-xs font-bold text-gray-500">MRP (₹)</label>
                        <input type="number" value={v.mrp} onChange={(e)=>updateVariant(i, 'mrp', Number(e.target.value))} className="w-full p-2 border rounded-lg text-gray-400 line-through" />
                    </div>
                    <button onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={20}/></button>
                </div>
            ))}
            <button onClick={addVariant} className="text-sm font-bold text-emerald-700 hover:underline">+ Add Another Size</button>
        </div>

        {/* 2. DYNAMIC IMAGES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><ImageIcon size={20} className="text-blue-600"/> Website Images</h2>
            
            {/* Hero Slider Control */}
            <div className="mb-6">
                <label className="text-sm font-bold text-gray-600 block mb-2">Hero Slider Images</label>
                {(data.heroImages || []).map((url: string, i: number) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={url} onChange={(e)=>handleArrayChange('heroImages', i, e.target.value)} className="w-full p-2 border rounded-lg text-xs" />
                        <button onClick={() => removeImageSlot('heroImages', i)} className="text-red-400"><Trash2 size={16}/></button>
                    </div>
                ))}
                <button onClick={() => addImageSlot('heroImages')} className="text-xs text-blue-600 font-bold">+ Add Image URL</button>
            </div>

            {/* Treatment Control */}
            <div>
                <label className="text-sm font-bold text-gray-600 block mb-2">Treatment Images</label>
                {(data.treatmentImages || []).map((url: string, i: number) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={url} onChange={(e)=>handleArrayChange('treatmentImages', i, e.target.value)} className="w-full p-2 border rounded-lg text-xs" />
                        <button onClick={() => removeImageSlot('treatmentImages', i)} className="text-red-400"><Trash2 size={16}/></button>
                    </div>
                ))}
                 <button onClick={() => addImageSlot('treatmentImages')} className="text-xs text-blue-600 font-bold">+ Add Image URL</button>
            </div>
        </div>

        {/* 3. REGIONAL CONTROL (WHITELIST) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-emerald-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={20} className="text-emerald-600"/> Delivery Whitelist</h2>
            
            <div className="mb-4">
                <label className="text-sm font-bold text-gray-600 block mb-2">Allowed Pincodes (Comma Separated)</label>
                <input 
                    type="text" 
                    placeholder="e.g., 452001, 452002, 452010"
                    value={data.deliveryRules?.allowedPincodes?.join(', ') || ''}
                    onChange={(e) => setData({...data, deliveryRules: { ...data.deliveryRules, allowedPincodes: e.target.value.split(',').map((s:string)=>s.trim()) } })} 
                    className="w-full p-3 border rounded-xl font-mono text-emerald-800" 
                />
            </div>

            <div>
                <label className="text-sm font-bold text-gray-600 block mb-2">Allowed States (Optional)</label>
                <input 
                    type="text" 
                    placeholder="e.g., Madhya Pradesh"
                    value={data.deliveryRules?.allowedStates?.join(', ') || ''}
                    onChange={(e) => setData({...data, deliveryRules: { ...data.deliveryRules, allowedStates: e.target.value.split(',').map((s:string)=>s.trim()) } })} 
                    className="w-full p-3 border rounded-xl" 
                />
            </div>
        </div>

        <button onClick={handleSave} disabled={loading} className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-black transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><Save /> Save All Changes</>}
        </button>

      </div>
    </div>
  );
};
export default ProductPage;