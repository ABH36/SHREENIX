'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket, Trash2, Plus, Sparkles, Tag, Percent, IndianRupee
} from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  discountAmount: number;
  discountType: string;
  isActive: boolean;
  usedCount: number;
  createdAt: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountAmount: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Coupons fetch error:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discountAmount) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.success) {
        setForm({ code: '', discountAmount: '' });
        fetchCoupons();
      } else {
        alert(data.error || 'Failed to create coupon');
      }
    } catch (error) {
      console.error('Coupon creation error:', error);
      alert('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (error) {
      console.error('Coupon delete error:', error);
    }
  };

  const generateRandomCode = () => {
    const codes = ['SAVE', 'DEAL', 'OFFER', 'FIRST', 'NEW'];
    const numbers = Math.floor(Math.random() * 900) + 100;
    const randomCode = codes[Math.floor(Math.random() * codes.length)] + numbers;
    setForm({ ...form, code: randomCode });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Coupon Manager</h1>
        <p className="text-gray-500 mt-1">Create and manage discount coupons</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Ticket className="text-emerald-600" size={20} />
            </div>
            <p className="text-sm text-gray-600 font-medium">Active Coupons</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {coupons.filter(c => c.isActive).length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="text-blue-600" size={20} />
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Used</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="text-purple-600" size={20} />
            </div>
            <p className="text-sm text-gray-600 font-medium">Avg Discount</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{coupons.length > 0 
              ? Math.round(coupons.reduce((sum, c) => sum + c.discountAmount, 0) / coupons.length)
              : 0
            }
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="flex items-center gap-2 text-emerald-800 font-bold mb-6 text-lg">
              <Sparkles size={20} />
              Create Coupon
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    placeholder="e.g. SAVE100"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold uppercase tracking-wider focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-3 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    title="Generate random code"
                  >
                    <Sparkles size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Amount (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="number"
                    placeholder="50"
                    min="1"
                    value={form.discountAmount}
                    onChange={(e) => setForm({ ...form, discountAmount: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800">
              Active Coupons ({coupons.length})
            </h2>
          </div>

          {coupons.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <Ticket size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No coupons created yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first discount coupon</p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl text-white shadow-lg">
                        <Ticket size={24} />
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-bold tracking-wider text-gray-900">
                            {coupon.code}
                          </h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            coupon.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <IndianRupee size={14} />
                            {coupon.discountAmount} OFF
                          </span>
                          <span className="text-gray-500">
                            Used: {coupon.usedCount} times
                          </span>
                          <span className="text-gray-400">
                            {new Date(coupon.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}