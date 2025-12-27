'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState({
    phone: '9630703732',
    email: 'shreenix.care@gmail.com',
    address: 'Indore, Madhya Pradesh'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data?.success && data?.config) {
          setContactInfo({
            phone: data.config.phone,
            email: data.config.email,
            address: data.config.address
          });
        }
      } catch {}
    };
    fetchSettings();
  }, []);

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    if (link.type === 'modal') {
      e.preventDefault();
      setActiveModal(link.key);
    }
  };

  const modalContent = activeModal ? (t.healthGuide as any)[activeModal] : null;

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#102820] to-[#1C6B4A] py-24 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4">

          <div className="space-y-6">
            <h3 className="font-serif text-2xl">Contact</h3>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-center gap-3 hover:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Phone className="h-5 w-5" />
                </span>
                <span className="font-mono text-lg">{contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Mail className="h-5 w-5" />
                </span>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </li>
              <li className="flex items-start gap-3 text-white/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="mt-2 text-sm">{contactInfo.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-serif text-xl">Company</h3>
            <ul className="space-y-3 text-white/70">
              {t.footer.company.links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.url || '#'} onClick={(e) => handleLinkClick(e, link)} className="hover:text-[#D4AF37] transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-serif text-xl">Information</h3>
            <ul className="space-y-3 text-white/70">
              {t.footer.info.links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.url || '#'} onClick={(e) => handleLinkClick(e, link)} className="hover:text-[#D4AF37] transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] bg-white/10 p-8 backdrop-blur-xl">
            <h2 className="font-serif text-2xl mb-2">Shreenix</h2>
            <p className="text-white/60 text-sm mb-6">India's most trusted fungal care solution.</p>
            <a href="#order" className="block w-full rounded-xl bg-[#D4AF37] py-3 text-center font-bold text-[#102820] hover:brightness-110">
              Order Now
            </a>
          </div>
        </div>

        <div className="mt-20 border-t border-white/20 pt-8 text-center text-xs text-white/40">
          {t.footer.copyright}
        </div>
      </div>

      <AnimatePresence>
        {activeModal && modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative z-10 w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 rounded-full bg-stone-100 p-2">
                <X size={20} />
              </button>
              <div className="mb-4 flex items-center gap-3 text-[#1C6B4A]">
                <Info className="h-6 w-6" />
                <h3 className="font-serif text-xl">{modalContent.title}</h3>
              </div>
              <div className="whitespace-pre-line rounded-xl bg-[#AEE4C2]/30 p-4 text-sm text-[#102820]">
                {modalContent.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
