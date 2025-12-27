'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { t, lang, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#F6F3EC]/95 backdrop-blur-xl shadow-lg border-b border-[#AEE4C2] py-2' : 'bg-[#F6F3EC]/70 backdrop-blur-md py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          <a href="#" className="relative h-12 sm:h-16 w-40 sm:w-56">
            <Image src="/logo.png" alt="Shreenix Logo" fill className="object-contain object-left" priority />
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="nav-link">{t.nav.benefits}</a>
            <a href="#ingredients" className="nav-link">{t.nav.ingredients}</a>
            <a href="#reviews" className="nav-link">{t.nav.reviews}</a>

            <button onClick={toggleLanguage} className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5FA777] text-[#1C6B4A] text-xs font-bold hover:bg-[#AEE4C2]/30 uppercase">
              <Globe className="w-3.5 h-3.5" /> {lang === 'hi' ? 'EN' : 'HI'}
            </button>

            <a href="#order" className="bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-xl hover:-translate-y-0.5 transition">
              {t.nav.order}
            </a>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleLanguage} className="border border-[#1C6B4A] text-[#1C6B4A] px-3 py-1 rounded-full text-xs font-bold">
              {lang === 'hi' ? 'EN' : 'HI'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#102820]">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#F6F3EC] border-t border-[#AEE4C2] shadow-2xl rounded-b-3xl max-h-[90vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-3">
            <a href="#benefits" onClick={()=>setIsOpen(false)} className="mobile-link">{t.nav.benefits}</a>
            <a href="#ingredients" onClick={()=>setIsOpen(false)} className="mobile-link">{t.nav.ingredients}</a>
            <a href="#reviews" onClick={()=>setIsOpen(false)} className="mobile-link">{t.nav.reviews}</a>
            <a href="#order" onClick={()=>setIsOpen(false)} className="mobile-link bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] text-white text-center">
              {t.nav.order}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
