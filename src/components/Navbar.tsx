'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, Globe, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { t, lang, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!t || !t.nav) return null;

  const navLinks = [
    { href: '#benefits', label: t.nav.benefits },
    { href: '#ingredients', label: t.nav.ingredients },
    { href: '#reviews', label: t.nav.reviews }
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${scrolled
          ? 'bg-[#F6F3EC]/95 backdrop-blur-xl shadow-lg border-b border-[#AEE4C2] py-2'
          : 'bg-[#F6F3EC]/70 backdrop-blur-md py-3'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <motion.a
            href="#"
            className="relative h-12 sm:h-16 w-40 sm:w-56"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo.png"
              alt="Shreenix Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="nav-link relative text-[#102820] font-medium hover:text-[#1C6B4A] transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1C6B4A] transition-all group-hover:w-full" />
              </motion.a>
            ))}

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5FA777] text-[#1C6B4A] text-xs font-bold hover:bg-[#AEE4C2]/30 uppercase transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'EN' : 'HI'}
            </motion.button>

            {/* Order Button */}
            <motion.a
              href="#order"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              {t.nav.order}
            </motion.a>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="border border-[#1C6B4A] text-[#1C6B4A] px-3 py-1 rounded-full text-xs font-bold"
            >
              {lang === 'hi' ? 'EN' : 'HI'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#102820] hover:text-[#1C6B4A] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-4">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Links */}
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-[#102820] font-medium hover:bg-[#AEE4C2]/30 hover:text-[#1C6B4A] transition-all"
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Mobile Order Button */}
                <motion.a
                  href="#order"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-4 bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] text-white text-center rounded-xl font-bold shadow-lg"
                >
                  {t.nav.order}
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}