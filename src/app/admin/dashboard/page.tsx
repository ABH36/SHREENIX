'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingCart, Users, Package, IndianRupee,
  Clock, CheckCircle, XCircle, Phone, ArrowUpRight, Calendar
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
  todayOrders: number;
  thisWeekRevenue: number;
  avgOrderValue: number;
}

interface RecentOrder {
  _id: string;
  customerDetails: {
    name: string;
    phone: string;
    city: string;
  };
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    todayOrders: 0,
    thisWeekRevenue: 0,
    avgOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, customersRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/customers')
      ]);

      const ordersData = await ordersRes.json();
      const customersData = await customersRes.json();

      if (ordersData.success) {
        const orders = ordersData.orders;

        // Calculate stats
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalPrice, 0);
        const pending = orders.filter((o: any) => o.orderStatus === 'Processing').length;
        const delivered = orders.filter((o: any) => o.orderStatus === 'Delivered').length;

        // Today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = orders.filter((o: any) => new Date(o.createdAt) >= today).length;

        // This week's revenue
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const thisWeekRevenue = orders
          .filter((o: any) => new Date(o.createdAt) >= weekAgo)
          .reduce((sum: number, o: any) => sum + o.totalPrice, 0);

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          pendingOrders: pending,
          deliveredOrders: delivered,
          totalCustomers: customersData.success ? customersData.customers.length : 0,
          todayOrders,
          thisWeekRevenue,
          avgOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0
        });

        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      gradient: 'from-emerald-500 to-emerald-700',
      change: `₹${stats.thisWeekRevenue.toLocaleString()} this week`,
      changePositive: true
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-blue-700',
      change: `${stats.todayOrders} today`,
      changePositive: true
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      gradient: 'from-orange-500 to-orange-700',
      change: 'Needs action',
      changePositive: false
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      gradient: 'from-purple-500 to-purple-700',
      change: `₹${stats.avgOrderValue} avg order`,
      changePositive: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return CheckCircle;
      case 'Cancelled': return XCircle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient} text-white`}>
                    <Icon size={24} />
                  </div>
                  <ArrowUpRight className="text-gray-400 group-hover:text-emerald-600 transition-colors" size={20} />
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className={stat.changePositive ? 'text-green-600' : 'text-orange-600'}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500">Latest 5 orders</p>
          </div>
          <a
            href="/admin/orders"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View All <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="divide-y divide-gray-100">
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p>No orders yet</p>
            </div>
          ) : (
            recentOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.orderStatus);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                        {order.customerDetails.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.customerDetails.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={12} />
                            {order.customerDetails.phone}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-700">₹{order.totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{order.customerDetails.city}</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                        <StatusIcon size={14} />
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-6 text-white">
          <TrendingUp className="mb-4" size={32} />
          <p className="text-emerald-100 text-sm mb-1">Delivered Orders</p>
          <p className="text-4xl font-bold">{stats.deliveredOrders}</p>
          <p className="text-emerald-200 text-sm mt-2">
            {stats.totalOrders > 0 
              ? `${Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}% completion rate`
              : 'No orders yet'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <Package className="mb-4 text-blue-600" size={32} />
          <p className="text-gray-600 text-sm mb-1">Average Order Value</p>
          <p className="text-4xl font-bold text-gray-900">₹{stats.avgOrderValue}</p>
          <p className="text-gray-500 text-sm mt-2">Per transaction</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <Users className="mb-4 text-purple-600" size={32} />
          <p className="text-gray-600 text-sm mb-1">Repeat Customers</p>
          <p className="text-4xl font-bold text-gray-900">
            {stats.totalCustomers > 0 
              ? Math.round((stats.totalCustomers / stats.totalOrders) * 100)
              : 0}%
          </p>
          <p className="text-gray-500 text-sm mt-2">Customer retention</p>
        </div>
      </div>
    </div>
  );
}