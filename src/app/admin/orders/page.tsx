// src/app/admin/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Search, Download, Phone, MapPin, Package, 
  ChevronDown, Filter, Calendar, IndianRupee
} from 'lucide-react';

interface Order {
  _id: string;
  customerDetails: {
    name: string;
    phone: string;
    city: string;
    address: string;
    pincode: string;
    state: string;
  };
  orderItems: { name: string; qty: number; price: number }[];
  totalPrice: number;
  orderStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.customerDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerDetails.phone.includes(searchQuery) ||
        order.customerDetails.pincode.includes(searchQuery) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'All') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'Today') return diffDays === 0;
        if (dateFilter === 'Week') return diffDays <= 7;
        if (dateFilter === 'Month') return diffDays <= 30;
        return true;
      });
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic update
    setOrders(prev =>
      prev.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );

    try {
      await fetch('/api/admin/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      fetchOrders(); // Revert on error
    }
  };

  const sendWhatsApp = (phone: string, name: string, status: string) => {
    let message = '';
    if (status === 'Processing') {
      message = `Namaste ${name}, aapka Shreenix order confirm ho gaya hai. Order ID: #${phone.slice(-4)}. Hum jald hi dispatch karenge. 🌿`;
    } else if (status === 'Shipped') {
      message = `${name} ji, aapka Shreenix order ship ho gaya hai! Jald hi aapke paas pahunchega. 📦`;
    } else {
      message = `Namaste ${name}, Shreenix Ayurveda mein aapka swagat hai! 🌿`;
    }
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const exportToCSV = () => {
    const headers = [
      'Order ID', 'Date', 'Customer', 'Phone', 'City', 'Pincode', 
      'State', 'Address', 'Products', 'Amount', 'Payment', 'Status'
    ];

    const rows = filteredOrders.map(order => [
      order._id,
      new Date(order.createdAt).toLocaleDateString('en-IN'),
      `"${order.customerDetails.name}"`,
      order.customerDetails.phone,
      order.customerDetails.city,
      order.customerDetails.pincode,
      order.customerDetails.state,
      `"${order.customerDetails.address}"`,
      `"${order.orderItems.map(i => `${i.name} x${i.qty}`).join(', ')}"`,
      order.totalPrice,
      order.paymentMethod || 'COD',
      order.orderStatus
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'Processing').length,
    shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.totalPrice, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
          <p className="text-sm text-yellow-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-700 mb-1">Shipped</p>
          <p className="text-2xl font-bold text-blue-800">{stats.shipped}</p>
        </div>
        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
          <p className="text-sm text-green-700 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-800">{stats.delivered}</p>
        </div>
        <div className="bg-emerald-600 p-5 rounded-xl text-white">
          <p className="text-sm text-emerald-100 mb-1">Revenue</p>
          <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, phone, pincode, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
          </select>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-xs font-mono text-gray-500">#{order._id.slice(-8)}</div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-lg font-bold text-emerald-700 mt-1 flex items-center gap-1">
                        <IndianRupee size={16} />
                        {order.totalPrice.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{order.customerDetails.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Phone size={12} />
                        {order.customerDetails.phone}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {order.customerDetails.city}, {order.customerDetails.pincode}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            <Package size={12} className="inline mr-1" />
                            {item.name} <span className="text-gray-500">x{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`
                            appearance-none px-3 py-2 pr-8 rounded-lg text-sm font-semibold
                            border cursor-pointer transition-colors
                            ${getStatusColor(order.orderStatus)}
                          `}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => sendWhatsApp(
                          order.customerDetails.phone,
                          order.customerDetails.name,
                          order.orderStatus
                        )}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="Send WhatsApp"
                      >
                        <Phone size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
}