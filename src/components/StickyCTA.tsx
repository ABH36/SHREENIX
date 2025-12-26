'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const StickyCTA = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [price, setPrice] = useState(499);
  const [mrp, setMrp] = useState(999);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    const fetchPrice = async () => {
      try {
        const res = await fetch('/api/admin/product');
        const data = await res.json();

        if (data?.success && data?.product) {
          setPrice(data.product.price);
          setMrp(data.product.mrp);
        }
      } catch (error) {
        console.error('StickyCTA price fetch failed');
      }
    };

    fetchPrice();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 z-40 w-full border-t border-stone-200 bg-white p-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] md:hidden"
        >
          <div className="flex items-center justify-between gap-3">

            <div className="flex flex-col pl-2">
              <span className="text-xs text-stone-400 line-through decoration-red-400">
                ₹{mrp}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-emerald-800">₹{price}</span>
                <span className="rounded bg-amber-100 px-1 text-[10px] font-bold text-amber-800">
                  SALE
                </span>
              </div>
            </div>

            <a
              href="#order"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 text-center font-bold text-white shadow-lg shadow-emerald-900/20 transition-transform active:scale-95"
            >
              {t.nav.order}
              <ArrowRight className="h-4 w-4" />
            </a>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
