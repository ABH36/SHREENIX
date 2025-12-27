'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ArrowLeft, Save, Loader2, Phone, Mail, MapPin,
  Megaphone, ToggleLeft, ToggleRight,
  LayoutDashboard, ShoppingBag, Users, LogOut, Settings, MessageSquare, TicketPercent, Menu, X
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
            <Settings className="text-emerald-600" size={24} /> Website Settings
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-24">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
              <h2 className="font-bold flex items-center gap-2 mb-6 text-gray-800">
                <Megaphone className="text-orange-500" /> Announcement Bar
              </h2>

              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl mb-6 border border-orange-100">
                <div>
                  <span className="text-sm font-bold text-gray-700 block">Status</span>
                  <span className="text-xs text-gray-500">{topBar.isActive ? 'Visible' : 'Hidden'}</span>
                </div>
                <button onClick={() => setTopBar({ ...topBar, isActive: !topBar.isActive })}>
                  {topBar.isActive
                    ? <ToggleRight size={40} className="text-emerald-500" />
                    : <ToggleLeft size={40} className="text-gray-400" />}
                </button>
              </div>

              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Announcement Text</label>
              <input
                value={topBar.text}
                onChange={e => setTopBar({ ...topBar, text: e.target.value })}
                placeholder="e.g. 50% OFF Sale Ends Tonight!"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="font-bold flex items-center gap-2 mb-6 text-gray-800">
                <Phone className="text-emerald-600" /> Contact Information
              </h2>

              <div className="space-y-4">
                {[
                  { icon: Phone, key: 'phone', type: 'text', placeholder: 'Phone Number' },
                  { icon: Mail, key: 'email', type: 'email', placeholder: 'Support Email' },
                  { icon: MapPin, key: 'address', type: 'textarea', placeholder: 'Office Address' }
                ].map((f: any, i) => (
                  <div key={i}>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{f.placeholder}</label>
                    <div className="relative">
                      <f.icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      {f.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={(contact as any)[f.key]}
                          onChange={e => setContact({ ...contact, [f.key]: e.target.value })}
                          className="w-full pl-9 p-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-100 outline-none"
                        />
                      ) : (
                        <input
                          type={f.type}
                          value={(contact as any)[f.key]}
                          onChange={e => setContact({ ...contact, [f.key]: e.target.value })}
                          className="w-full pl-9 p-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-100 outline-none"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 md:right-10">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-emerald-900 text-white px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-3 font-bold"
          >
            {loading ? <Loader2 className="animate-spin" /> : (<><Save /> Save All Changes</>)}
          </button>
        </div>
      </main>
    </div>
  );
}
