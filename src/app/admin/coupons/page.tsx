'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ArrowLeft, TicketPercent, Trash2, Sparkles, LayoutDashboard,
  ShoppingBag, Users, LogOut, Settings, MessageSquare, Menu, X
} from 'lucide-react';

interface CouponType {
  _id: string;
  code: string;
  discountAmount: number;
}

export default function CouponManager() {
  const router = useRouter();
  const pathname = usePathname();

  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ code: '', discountAmount: '' });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
    <div className="flex flex-col h-full justify-between bg-white border-r border-gray-200">
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

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      <aside className="w-64 hidden md:flex flex-col">
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
        <div className="bg-white border-b px-6 py-4 flex items-center gap-4 shrink-0">
          <button onClick={() => setIsMobileNavOpen(true)} className="md:hidden p-2 bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <TicketPercent className="text-emerald-600" size={24} /> Coupon Manager
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
              <h2 className="flex items-center gap-2 text-emerald-800 font-bold mb-6 text-lg">
                <Sparkles size={20} /> Create New Coupon
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Coupon Code</label>
                  <input
                    placeholder="e.g. SAVE50"
                    className="w-full p-3 border rounded-xl font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-200"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Discount Amount (₹)</label>
                  <input
                    placeholder="e.g. 50"
                    type="number"
                    className="w-full p-3 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-200"
                    value={form.discountAmount}
                    onChange={e => setForm({ ...form, discountAmount: e.target.value })}
                    required
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-70"
                >
                  {loading ? 'Creating...' : 'Create Coupon'}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h2 className="font-bold text-gray-800 mb-2">Active Coupons ({coupons.length})</h2>

              {coupons.length === 0 && (
                <div className="bg-gray-100 p-8 rounded-2xl text-center text-gray-400">
                  No active coupons found.
                </div>
              )}

              <div className="space-y-3">
                {coupons.map(c => (
                  <div
                    key={c._id}
                    className="bg-white p-5 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                        <TicketPercent size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-lg tracking-wider text-gray-900">{c.code}</div>
                        <div className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md w-fit">
                          FLAT ₹{c.discountAmount} OFF
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
