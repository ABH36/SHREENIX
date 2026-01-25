'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingCart, Sparkles } from 'lucide-react';

export default function StickyCTA() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [price, setPrice] = useState(499);
  const [mrp, setMrp] = useState(999);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    fetchPrice();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPrice = async () => {
    try {
      const res = await fetch('/api/admin/product');
      const data = await res.json();

      if (data?.success && data?.product?.variants?.length > 0) {
        const firstVariant = data.product.variants[0];
        setPrice(firstVariant.price);
        setMrp(firstVariant.mrp);
      }
    } catch (error) {
      console.error('StickyCTA price fetch failed');
    } finally {
      setLoading(false);
    }
  };

  if (!t || !t.nav) return null;

  const discount = Math.round(((mrp - price) / mrp) * 100);

  return (
    <AnimatePresence>
      {isVisible && !loading && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 z-40 w-full md:hidden"
        >
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]" />

          {/* Content */}
          <div className="relative p-3">
            <div className="flex items-center justify-between gap-3">
              {/* Price Info */}
              <div className="flex flex-col pl-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 line-through decoration-red-400">
                    ₹{mrp}
                  </span>
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-emerald-800">₹{price}</span>
                  <Sparkles className="text-amber-500" size={14} />
                </div>
              </div>

              {/* CTA Button */}
              <motion.a
                href="#order"
                whileTap={{ scale: 0.95 }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 px-6 py-3 text-center font-bold text-white shadow-lg active:shadow-xl transition-shadow"
              >
                <ShoppingCart size={18} />
                {t.nav.order}
                <ArrowRight size={16} />
              </motion.a>
            </div>

            {/* Free Delivery Badge */}
            <div className="mt-2 text-center">
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
                🎉 Free Delivery on Prepaid Orders
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}