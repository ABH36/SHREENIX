'use client';

import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, ShoppingBag, Users, LogOut, Settings, MessageSquare, TicketPercent,
  Search, Bell, ChevronDown, Phone, MapPin, Clock, Download, Menu, X
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface OrderType {
  _id: string;
  customerDetails: {
    name: string; phone: string; city: string; address: string; pincode: string; state: string;
  };
  orderItems: { name: string; qty: number }[];
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

const Dashboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filter, setFilter] = useState('');
  const [stats, setStats] = useState({ revenue: 0, orders: 0, pending: 0 });
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => { checkForNewOrders(); }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        calculateStats(data.orders);
      }
    } catch {
      console.error('Fetch Error');
    }
  };

  const checkForNewOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(prev => {
          if (data.orders.length > prev.length) setHasNewNotification(true);
          return data.orders;
        });
        calculateStats(data.orders);
      }
    } catch {
      console.error('Polling Error');
    }
  };

  const calculateStats = (data: OrderType[]) => {
    const revenue = data.reduce((acc, order) => acc + order.totalPrice, 0);
    const pending = data.filter(o => o.orderStatus === 'Processing').length;
    setStats({ revenue, orders: data.length, pending });
    if (pending > 0) setHasNewNotification(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    await fetch('/api/admin/update-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus })
    });
    calculateStats(orders);
  };

  const sendWhatsApp = (phone: string, name: string) => {
    const msg = `Namaste ${name}, Apka Shreenix order confirm ho gaya hai. Hum jald hi dispatch karenge.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleExport = () => {
    const headers = ['Order Date', 'Customer Name', 'Phone', 'Address', 'City', 'Pincode', 'State', 'Product', 'Amount', 'Status'];
    const rows = filteredOrders.map(order => [
      new Date(order.createdAt).toLocaleDateString('en-IN'),
      `"${order.customerDetails.name}"`, order.customerDetails.phone, `"${order.customerDetails.address}"`,
      order.customerDetails.city, order.customerDetails.pincode, order.customerDetails.state,
      `"${order.orderItems.map(i => `${i.name} x${i.qty}`).join(' | ')}"`,
      order.totalPrice, order.orderStatus
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Shreenix_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <h1 className="text-2xl font-serif font-bold text-emerald-900 tracking-tight">
            Shreenix<span className="text-emerald-500">.</span>
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
            { icon: ShoppingBag, label: 'Products (Price)', path: '/admin/products' },
            { icon: Users, label: 'Customers', path: '/admin/customers' },
            { icon: MessageSquare, label: 'Manage Reviews', path: '/admin/reviews' },
            { icon: TicketPercent, label: 'Coupons', path: '/admin/coupons' },
            { icon: Settings, label: 'Website Settings', path: '/admin/settings' }
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

  const filteredOrders = orders.filter(o =>
    o.customerDetails.name.toLowerCase().includes(filter.toLowerCase()) ||
    o.customerDetails.phone.includes(filter)
  );

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
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
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileNavOpen(true)} className="md:hidden p-2 bg-gray-100 rounded-lg">
              <Menu size={20} className="text-gray-700" />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Overview</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm font-bold text-black placeholder-gray-500 outline-none w-64"
              />
            </div>

            <button className="p-2 bg-gray-100 rounded-full relative" onClick={() => setHasNewNotification(false)}>
              <Bell size={20} className={hasNewNotification ? 'text-emerald-600' : 'text-gray-600'} />
              {hasNewNotification && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 rounded-2xl text-white shadow-lg">
              <p className="text-emerald-100 text-sm font-medium mb-1">Revenue</p>
              <h3 className="text-2xl md:text-3xl font-bold">₹{stats.revenue.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-sm font-medium mb-1">Orders</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{stats.orders}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <p className="text-gray-400 text-sm font-medium mb-1">Pending</p>
              <h3 className="text-2xl md:text-3xl font-bold text-amber-500">{stats.pending}</h3>
              <Clock className="absolute right-4 top-4 text-amber-100" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                Recent Orders <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{filteredOrders.length}</span>
              </h3>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-emerald-700 font-bold text-xs md:text-sm rounded-lg shadow-sm">
                  <Download size={14} /> Export CSV
                </button>
                <button onClick={fetchOrders} className="text-xs md:text-sm text-gray-500 font-medium underline">Refresh</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{order.customerDetails.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} /> {order.customerDetails.phone}</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {order.customerDetails.city}, {order.customerDetails.pincode}</div>
                        <div className="text-xs font-bold text-emerald-700 mt-1">₹{order.totalPrice}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block w-32">
                          <select
                            value={order.orderStatus}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                            className={`w-full appearance-none px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer ${
                              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                              order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2 h-3 w-3 opacity-50 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => sendWhatsApp(order.customerDetails.phone, order.customerDetails.name)}
                          className="p-2 text-green-600 bg-green-50 rounded-lg shadow-sm"
                        >
                          <Phone size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-400">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
