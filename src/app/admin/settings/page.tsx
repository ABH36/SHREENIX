'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Loader2, Phone, Mail, MapPin, Megaphone,
  Globe, Settings as SettingsIcon, CheckCircle
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    address: ''
  });
  const [topBar, setTopBar] = useState({
    text: '',
    isActive: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [settingsRes, productRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/product')
      ]);

      const settingsData = await settingsRes.json();
      const productData = await productRes.json();

      if (settingsData.success) {
        setContact({
          phone: settingsData.config.phone || '',
          email: settingsData.config.email || '',
          address: settingsData.config.address || ''
        });
      }

      if (productData.success && productData.product?.topBar) {
        setTopBar(productData.product.topBar);
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
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

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Settings save error:', error);
      alert('Failed to save settings');
      setSaveStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-gray-500 mt-1">Manage global website configuration</p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white
            shadow-lg transition-all
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}
            ${saveStatus === 'success' ? 'bg-green-500' : ''}
          `}
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <CheckCircle size={20} />
              Saved!
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Announcement Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Megaphone className="text-orange-600" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">Announcement Bar</h2>
            <p className="text-sm text-gray-500">Top banner message for promotions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div>
              <p className="font-semibold text-gray-900">Display Status</p>
              <p className="text-sm text-gray-600">
                {topBar.isActive ? 'Visible to customers' : 'Hidden from website'}
              </p>
            </div>
            <button
              onClick={() => setTopBar({ ...topBar, isActive: !topBar.isActive })}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors
                ${topBar.isActive ? 'bg-emerald-600' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white
                  transition-transform
                  ${topBar.isActive ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Announcement Text
            </label>
            <textarea
              rows={2}
              value={topBar.text}
              onChange={(e) => setTopBar({ ...topBar, text: e.target.value })}
              placeholder="e.g. 🎉 50% OFF Sale Ends Tonight! Free Shipping on All Orders"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {topBar.isActive && topBar.text && (
            <div className="bg-emerald-900 text-white p-3 rounded-xl text-center text-sm font-medium">
              Preview: {topBar.text}
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Phone className="text-emerald-600" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">Contact Information</h2>
            <p className="text-sm text-gray-500">Customer support & business details</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="9630703732"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Support Email
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="support@shreenix.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Business Address
            </label>
            <textarea
              rows={3}
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              placeholder="123 Main Street, Indore, Madhya Pradesh, India"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Additional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-emerald-50 to-white rounded-xl shadow-sm border border-emerald-100 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <Globe className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Quick Info</h3>
            <p className="text-sm text-gray-600">Your current configuration</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Website Status</p>
            <p className="font-bold text-green-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Top Bar</p>
            <p className="font-bold text-gray-900">
              {topBar.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Contact Methods</p>
            <p className="font-bold text-gray-900">3 Channels</p>
          </div>
        </div>
      </motion.div>

      {/* Save Button (Mobile) */}
      <div className="md:hidden">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}