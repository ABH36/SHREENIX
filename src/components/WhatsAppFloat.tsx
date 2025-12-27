'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const pathname = usePathname();
  const [phone, setPhone] = useState('');
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if(data.success && data.config && data.config.phone) {
          setPhone(data.config.phone);
        }
      });
  }, []);
  if (pathname.startsWith('/admin')) return null;
  if (!phone) return null;

  const handleClick = () => {
    const message = "Hello Shreenix, mujhe product ke baare mein jaankari chahiye.";
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed z-[60] bottom-24 right-4 md:bottom-8 md:right-8 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 md:p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center group animate-bounce-slow"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 md:w-8 md:h-8" fill="white" />
      <span className="hidden md:block absolute right-full mr-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat with us
      </span>
      <span className="absolute inset-0 rounded-full border border-[#25D366] animate-ping opacity-75"></span>
    </button>
  );
};

export default WhatsAppFloat;