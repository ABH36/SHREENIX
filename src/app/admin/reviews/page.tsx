'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Trash2, Plus, User, MapPin } from 'lucide-react';

export default function ReviewsAdmin() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', location: '', rating: 5, comment: '' });

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    if (data.success) setReviews(data.reviews);
  };

  useEffect(() => { fetchReviews(); }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 bg-white rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Customer Reviews</h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Review */}
          <div className="bg-white p-6 rounded-2xl border sticky top-6">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-emerald-800">
              <Plus /> Add Review
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['name','location'].map((field, i) => (
                <div key={i} className="relative">
                  {field === 'name' ? (
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                  ) : (
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                  )}
                  <input
                    required
                    placeholder={field}
                    value={(form as any)[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    className="w-full pl-9 p-2 border rounded-xl text-sm"
                  />
                </div>
              ))}

              <select value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} className="w-full p-2 border rounded-xl">
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{'⭐'.repeat(r)} ({r})</option>)}
              </select>

              <textarea
                rows={4}
                required
                placeholder="Customer review"
                value={form.comment}
                onChange={e => setForm({ ...form, comment: e.target.value })}
                className="w-full p-3 border rounded-xl"
              />

              <button disabled={loading} className="w-full bg-emerald-800 text-white py-3 rounded-xl font-bold">
                {loading ? 'Saving...' : 'Publish Review'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-gray-800">Live Reviews ({reviews.length})</h2>
            {reviews.map(r => (
              <div key={r._id} className="bg-white p-5 rounded-2xl border flex justify-between gap-4">
                <div>
                  <h3 className="font-bold">{r.name} <span className="text-xs text-gray-400">• {r.location}</span></h3>
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-gray-600">"{r.comment}"</p>
                </div>
                <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
