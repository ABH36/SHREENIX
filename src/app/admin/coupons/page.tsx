'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TicketPercent, Trash2, Sparkles } from 'lucide-react';

interface CouponType {
  _id: string;
  code: string;
  discountAmount: number;
}

export default function CouponManager() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ code: '', discountAmount: '' });

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    const res = await fetch('/api/admin/coupons');
    const data = await res.json();
    if (data.success) setCoupons(data.coupons);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discountAmount) return;

    setLoading(true);
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (data.success) {
      setForm({ code: '', discountAmount: '' });
      loadCoupons();
    } else {
      alert(data.error || 'Coupon already exists');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
    loadCoupons();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 bg-white rounded-lg hover:bg-emerald-50">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Coupon Manager</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* CREATE */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="flex items-center gap-2 text-emerald-800 font-bold mb-4">
              <Sparkles /> Create Coupon
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                placeholder="COUPON CODE"
                className="w-full p-3 border rounded-lg font-bold uppercase tracking-widest"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
              />
              <input
                placeholder="Discount Amount ₹"
                type="number"
                className="w-full p-3 border rounded-lg font-bold"
                value={form.discountAmount}
                onChange={e => setForm({ ...form, discountAmount: e.target.value })}
                required
              />
              <button disabled={loading} className="w-full bg-emerald-800 text-white py-3 rounded-xl font-bold hover:bg-black">
                {loading ? 'Creating...' : 'Create Coupon'}
              </button>
            </form>
          </div>

          {/* LIST */}
          <div>
            <h2 className="font-bold mb-3">Active Coupons ({coupons.length})</h2>
            {coupons.length === 0 && <p className="text-gray-400">No coupons available.</p>}
            <div className="space-y-3">
              {coupons.map(c => (
                <div key={c._id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                      <TicketPercent size={22} />
                    </div>
                    <div>
                      <div className="font-bold tracking-widest">{c.code}</div>
                      <div className="text-xs text-green-600 font-bold">₹{c.discountAmount} OFF</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
