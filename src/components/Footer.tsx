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
      } catch {
        console.log('Using default footer info');
      }
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
    <footer className="relative overflow-hidden border-t border-emerald-900 bg-emerald-950 py-16 text-emerald-100">

      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">
              {t.footer.contact.title}
            </h3>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 transition-colors hover:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800 bg-emerald-900/50">
                  <Phone className="h-5 w-5" />
                </span>
                <span className="font-mono text-lg">{contactInfo.phone}</span>
              </li>

              <li className="flex items-center gap-3 transition-colors hover:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800 bg-emerald-900/50">
                  <Mail className="h-5 w-5" />
                </span>
                <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                  {contactInfo.email}
                </a>
              </li>

              <li className="flex items-start gap-3 opacity-80">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-800 bg-emerald-900/50">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="mt-2 text-sm leading-relaxed">
                  {contactInfo.address}
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 font-serif text-xl font-bold text-white">
              {t.footer.company.title}
            </h3>
            <ul className="space-y-3">
              {t.footer.company.links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a
                    href={link.url || '#'}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="flex cursor-pointer items-center gap-2 text-sm transition-colors hover:text-amber-400 md:text-base"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-6 font-serif text-xl font-bold text-white">
              {t.footer.info.title}
            </h3>
            <ul className="space-y-3">
              {t.footer.info.links.map((link: any, idx: number) => (
                <li key={idx}>
                  <a
                    href={link.url || '#'}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="flex cursor-pointer items-center gap-2 text-sm transition-colors hover:text-amber-400 md:text-base"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand */}
          <div className="rounded-2xl border border-emerald-800/50 bg-emerald-900/30 p-6">
            <h2 className="mb-2 font-serif text-2xl font-bold text-white">
              Shreenix
            </h2>
            <p className="mb-6 text-xs text-emerald-300">
              India's most trusted solution for fungal infections.
            </p>
            <a
              href="#order"
              className="block w-full rounded-xl bg-white py-3 text-center font-bold text-emerald-950 shadow-lg transition-all hover:bg-amber-400"
            >
              Order Now
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-emerald-900 pt-8 text-center text-xs text-emerald-400/60">
          {t.footer.copyright}
        </div>
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
              className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute right-4 top-4 rounded-full bg-stone-100 p-2 hover:bg-red-100"
              >
                <X size={20} />
              </button>

              <div className="mb-4 flex items-center gap-3 text-emerald-800">
                <Info className="h-6 w-6" />
                <h3 className="font-serif text-xl font-bold">
                  {modalContent.title}
                </h3>
              </div>

              <div className="whitespace-pre-line rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-relaxed text-stone-700">
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
