'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ArrowLeft, Search, User, Phone, LayoutDashboard, ShoppingBag,
  Users, LogOut, Settings, MessageSquare, TicketPercent, Menu, X
} from 'lucide-react';

interface CustomerType {
  _id: string;
  name: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCustomers(data.customers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sendWhatsApp = (phone: string, name: string) => {
    const msg = `Namaste ${name}, Shreenix Ayurveda se judne ke liye dhanyawad!`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
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

  const filteredCustomers = customers.filter(c =>
    (c.name?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (c._id || '').includes(filter) ||
    (c.city?.toLowerCase() || '').includes(filter.toLowerCase())
  );

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
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileNavOpen(true)} className="md:hidden p-2 bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Users className="text-emerald-600" size={24} /> Customer Database
              </h1>
              <p className="text-xs text-gray-400 font-medium">{customers.length} Total Customers</p>
            </div>
          </div>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Search name, phone or city..."
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700 outline-none w-64 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="md:hidden mb-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[600px]">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">City</th>
                    <th className="p-4 text-center">Orders</th>
                    <th className="p-4 text-right">Spent</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-400">
                        <div className="flex justify-center"><span className="animate-pulse">Loading Data...</span></div>
                      </td>
                    </tr>
                  )}

                  {!loading && filteredCustomers.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                            {(c.name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{c.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500 font-mono">{c._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{c.city}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-md font-bold text-xs ${c.totalOrders > 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          {c.totalOrders} {c.totalOrders > 2 && '👑'}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-700">₹{c.totalSpent.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => sendWhatsApp(c._id, c.name)}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-transform active:scale-95 shadow-sm border border-green-100"
                        >
                          <Phone size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && filteredCustomers.length === 0 && (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                  <User size={48} className="mb-2 opacity-20" />
                  <p>No customers found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
