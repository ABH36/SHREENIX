// src/components/admin/AdminSidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Ticket,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Image,
  MapPin,
  Bell,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { id: 'orders', icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { id: 'products', icon: Package, label: 'Products', href: '/admin/products' },
  { id: 'customers', icon: Users, label: 'Customers', href: '/admin/customers' },
  { id: 'reviews', icon: MessageSquare, label: 'Reviews', href: '/admin/reviews' },
  { id: 'coupons', icon: Ticket, label: 'Coupons', href: '/admin/coupons' },
  { id: 'media', icon: Image, label: 'Media Library', href: '/admin/media' },
  { id: 'pincodes', icon: MapPin, label: 'Delivery Zones', href: '/admin/pincodes' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { id: 'settings', icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-emerald-900 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2 p-4 border-b border-emerald-800">
          <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Shreenix</h1>
            <p className="text-xs text-emerald-300">Admin Panel</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-lg'
                      : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-emerald-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-red-300 hover:bg-red-900/20 hover:text-red-200
              transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle - will be controlled by AdminHeader */}
    </>
  );
}