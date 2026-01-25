'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopBarSettings {
  isActive: boolean;
  text: string;
}

export default function TopBar() {
  const [settings, setSettings] = useState<TopBarSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopBar();
  }, []);

  const fetchTopBar = async () => {
    try {
      const res = await fetch('/api/admin/product');
      const data = await res.json();

      if (data?.success && data?.product?.topBar) {
        setSettings(data.product.topBar);
      }
    } catch (error) {
      console.error('TopBar fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if loading or inactive
  if (loading || !settings?.isActive || !settings?.text) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-50 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 px-4 py-2.5 text-center text-xs md:text-sm font-medium tracking-wide text-white overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="hidden sm:inline">✨</span>
          <span className="font-semibold">{settings.text}</span>
          <span className="hidden sm:inline">✨</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}