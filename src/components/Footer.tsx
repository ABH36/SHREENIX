'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, X, Info, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    phone: '9630703732',
    email: 'shreenix.care@gmail.com',
    address: 'Indore, Madhya Pradesh'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      
      if (data?.success && data?.config) {
        setContactInfo({
          phone: data.config.phone || contactInfo.phone,
          email: data.config.email || contactInfo.email,
          address: data.config.address || contactInfo.address
        });
      }
    } catch (error) {
      console.error('Footer settings fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    if (link.type === 'modal') {
      e.preventDefault();
      setActiveModal(link.key);
    }
  };

  if (!t || !t.footer) return null;

  const modalContent = activeModal && t.healthGuide ? (t.healthGuide as any)[activeModal] : null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#102820] to-[#1C6B4A] py-24 text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-emerald-300 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-serif text-2xl">Contact</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="h-10 bg-white/10 rounded animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
              </div>
            ) : (
              <ul className="space-y-4 text-white/80">
                <li className="flex items-center gap-3 hover:text-white transition-colors group cursor-pointer">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Phone className="h-5 w-5" />
                  </span>
                  <a href={`tel:${contactInfo.phone}`} className="font-mono text-lg">
                    {contactInfo.phone}
                  </a>
                </li>

                <li className="flex items-center gap-3 hover:text-white transition-colors group cursor-pointer">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Mail className="h-5 w-5" />
                  </span>
                  <a href={`mailto:${contactInfo.email}`} className="break-all">
                    {contactInfo.email}
                  </a>
                </li>

                <li className="flex items-start gap-3 text-white/60 group cursor-pointer">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="mt-2 text-sm leading-relaxed">
                    {contactInfo.address}
                  </span>
                </li>
              </ul>
            )}
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="mb-6 font-serif text-xl">Company</h3>
            <ul className="space-y-3 text-white/70">
              {t.footer.company.links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a
                    href={link.url || '#'}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="hover:text-[#D4AF37] transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Information Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-6 font-serif text-xl">Information</h3>
            <ul className="space-y-3 text-white/70">
              {t.footer.info.links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a
                    href={link.url || '#'}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="hover:text-[#D4AF37] transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Brand Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-[32px] bg-white/10 p-8 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all"
          >
            <h2 className="font-serif text-2xl mb-2 flex items-center gap-2">
              Shreenix
              <Heart className="text-red-400" size={20} fill="currentColor" />
            </h2>
            <p className="text-white/60 text-sm mb-6">
              India's most trusted fungal care solution.
            </p>
            <a
              href="#order"
              className="block w-full rounded-xl bg-[#D4AF37] py-3 text-center font-bold text-[#102820] hover:bg-[#D4AF37]/90 transition-all shadow-lg hover:shadow-xl"
            >
              Order Now
            </a>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 border-t border-white/20 pt-8 text-center text-xs text-white/40"
        >
          <p>© {currentYear} {t.footer.copyright}</p>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute right-4 top-4 rounded-full bg-stone-100 p-2 hover:bg-stone-200 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="mb-4 flex items-center gap-3 text-[#1C6B4A]">
                <Info className="h-6 w-6" />
                <h3 className="font-serif text-xl">{modalContent.title}</h3>
              </div>
              <div className="whitespace-pre-line rounded-xl bg-[#AEE4C2]/30 p-4 text-sm text-[#102820] max-h-96 overflow-y-auto">
                {modalContent.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}