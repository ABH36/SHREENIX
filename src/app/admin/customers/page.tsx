'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, User, MapPin, Phone } from 'lucide-react';

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
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCustomers(data.customers);
        setLoading(false);
      });
  }, []);

  const sendWhatsApp = (phone: string, name: string) => {
    const msg = `Namaste ${name}, Shreenix Ayurveda se judne ke liye dhanyawad!`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c._id.includes(filter) ||
    c.city.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* HEADER */}
      <div className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <User className="text-emerald-600" /> Customers
            </h1>
            <p className="text-xs text-gray-400">{customers.length} Total Customers</p>
          </div>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search name, phone or city..."
            className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-black outline-none w-80"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="p-8">
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th>City</th>
                <th className="text-center">Orders</th>
                <th className="text-right">Spent</th>
                <th className="text-right">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading...</td></tr>}
              {!loading && filteredCustomers.map(c => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold">{c.name}</div>
                        <div className="text-xs text-gray-400">{c._id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.city}</td>
                  <td className="text-center">
                    <span className="font-bold">{c.totalOrders}</span>
                    {c.totalOrders > 1 && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 rounded-full">VIP</span>}
                  </td>
                  <td className="text-right font-bold text-emerald-700">₹{c.totalSpent.toLocaleString()}</td>
                  <td className="text-right">
                    <button onClick={() => sendWhatsApp(c._id, c.name)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:scale-105">
                      <Phone size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredCustomers.length === 0 && (
            <div className="p-10 text-center text-gray-400">No customer found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
