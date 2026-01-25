'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetchPhone();
  }, []);

  const fetchPhone = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();

      if (data.success && data.config && data.config.phone) {
        setPhone(data.config.phone);
      }
    } catch (error) {
      console.error('WhatsApp phone fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show on admin pages or if loading/no phone
  if (pathname.startsWith('/admin') || loading || !phone) return null;

  const handleClick = () => {
    const message = "Hello Shreenix, mujhe product ke baare mein jaankari chahiye.";
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed z-[60] bottom-24 right-4 md:bottom-8 md:right-8"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-xl hidden md:block"
          >
            Chat with us
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="border-8 border-transparent border-l-gray-800" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 md:p-5 rounded-full shadow-2xl transition-all flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        {/* Animated Rings */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75" />
        <span className="absolute inset-0 rounded-full border border-[#25D366] animate-pulse" />

        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 relative z-10" fill="white" />
        </motion.div>

        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg animate-bounce">
          1
        </span>
      </motion.button>
    </motion.div>
  );
}