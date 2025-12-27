'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ArrowLeft, Star, Trash2, Plus, User, MapPin,
  LayoutDashboard, ShoppingBag, Users, LogOut, Settings, MessageSquare, TicketPercent, Menu, X, Loader2
} from 'lucide-react';

export default function ReviewsAdmin() {
  const router = useRouter();
  const pathname = usePathname();

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', rating: 5, comment: '' });

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch {
      console.error('Review fetch error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', location: '', rating: 5, comment: '' });
    fetchReviews();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
    fetchReviews();
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
            <MessageSquare className="text-emerald-600" size={24} /> Manage Reviews
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-0">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-emerald-800 text-lg">
                <Plus size={20} /> Add New Review
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {['name', 'location'].map((field, i) => (
                  <div key={i} className="relative">
                    {field === 'name'
                      ? <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      : <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />}
                    <input
                      required
                      placeholder={field === 'name' ? 'Customer Name' : 'City / Location'}
                      value={(form as any)[field]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      className="w-full pl-9 p-3 border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Rating</label>
                  <select
                    value={form.rating}
                    onChange={e => setForm({ ...form, rating: +e.target.value })}
                    className="w-full p-3 border rounded-xl font-bold text-amber-500 outline-none"
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r}>{'⭐'.repeat(r)} ({r} Stars)</option>
                    ))}
                  </select>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Write customer review here..."
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  disabled={loading}
                  className="w-full bg-emerald-800 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Publish Review'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-bold text-gray-800 text-lg">Live Reviews ({reviews.length})</h2>

              {reviews.length === 0 && (
                <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                  No reviews added yet.
                </div>
              )}

              {reviews.map(r => (
                <div key={r._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{r.name}</h3>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {r.location}
                      </span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">"{r.comment}"</p>
                  </div>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="self-start sm:self-center text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
