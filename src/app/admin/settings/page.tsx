'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Loader2, Phone, Mail, MapPin,
  Megaphone, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [contact, setContact] = useState({ phone: '', email: '', address: '' });
  const [topBar, setTopBar] = useState({ text: '', isActive: false });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/settings').then(r => r.json()),
      fetch('/api/admin/product').then(r => r.json())
    ]).then(([settings, product]) => {
      if (settings.success) setContact(settings.config);
      if (product.success && product.product?.topBar) setTopBar(product.product.topBar);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact)
        }),
        fetch('/api/admin/product', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topBar })
        })
      ]);
      alert('Settings updated successfully!');
    } catch {
      alert('Failed to update settings');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 bg-white rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Website Master Settings</h1>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Announcement Bar */}
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Megaphone className="text-orange-500" /> Announcement Bar
            </h2>

            <div className="flex justify-between bg-orange-50 p-4 rounded-xl mb-4">
              <span className="text-sm">Status</span>
              <button onClick={() => setTopBar({ ...topBar, isActive: !topBar.isActive })}>
                {topBar.isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
              </button>
            </div>

            <input
              value={topBar.text}
              onChange={e => setTopBar({ ...topBar, text: e.target.value })}
              placeholder="Announcement text"
              className="w-full border rounded-xl p-3"
            />
          </div>

          {/* Contact Info */}
          <div className="bg-white p-6 rounded-2xl border space-y-4">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Phone className="text-emerald-600" /> Contact Information
            </h2>

            {[
              { icon: Phone, key: 'phone', type: 'text', placeholder: 'Phone' },
              { icon: Mail, key: 'email', type: 'email', placeholder: 'Email' },
              { icon: MapPin, key: 'address', type: 'textarea', placeholder: 'Address' }
            ].map((f: any, i) => (
              <div key={i} className="relative">
                <f.icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                {f.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={(contact as any)[f.key]}
                    onChange={e => setContact({ ...contact, [f.key]: e.target.value })}
                    className="w-full pl-9 p-2 border rounded-xl"
                  />
                ) : (
                  <input
                    type={f.type}
                    value={(contact as any)[f.key]}
                    onChange={e => setContact({ ...contact, [f.key]: e.target.value })}
                    className="w-full pl-9 p-2 border rounded-xl"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="fixed bottom-6 right-6 bg-emerald-900 text-white px-8 py-4 rounded-full shadow-xl flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Save /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
