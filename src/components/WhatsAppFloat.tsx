'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const pathname = usePathname();
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();

        if (data?.success && data?.config?.phone) {
          setPhone(data.config.phone);
        }
      } catch (error) {
        console.error('Failed to load WhatsApp number');
      }
    };

    fetchSettings();
  }, []);

  if (pathname.startsWith('/admin') || !phone) return null;

  const handleClick = () => {
    const message = 'Hello Shreenix, mujhe product ke baare mein jaankari chahiye.';
    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-[#25D366] p-4 text-white shadow-2xl transition-transform hover:scale-110 hover:bg-[#20bd5a] group animate-bounce-slow"
    >
      <MessageCircle size={32} fill="white" />

      <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
        Chat with us
      </span>

      <span className="absolute inset-0 rounded-full border border-[#25D366] opacity-75 animate-ping" />
    </button>
  );
};

export default WhatsAppFloat;
