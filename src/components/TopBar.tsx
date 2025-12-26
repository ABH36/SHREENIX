'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopBarSettings {
  isActive: boolean;
  text: string;
}

const TopBar = () => {
  const [settings, setSettings] = useState<TopBarSettings | null>(null);

  useEffect(() => {
    const fetchTopBar = async () => {
      try {
        const res = await fetch('/api/admin/product');
        const data = await res.json();

        if (data?.success && data?.product?.topBar) {
          setSettings(data.product.topBar);
        }
      } catch (error) {
        console.error('TopBar fetch error');
      }
    };

    fetchTopBar();
  }, []);

  if (!settings?.isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative z-50 bg-emerald-900 px-4 py-2 text-center text-xs font-medium tracking-wide text-white md:text-sm"
      >
        {settings.text}
      </motion.div>
    </AnimatePresence>
  );
};

export default TopBar;
