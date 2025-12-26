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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200 py-2' 
          : 'bg-white/50 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <a href="#" className="relative h-16 w-56"> 
              <Image 
                src="/logo.png" 
                alt="Shreenix Logo" 
                fill
                className="object-contain object-left" 
                priority
              />
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-stone-700 hover:text-emerald-800 font-medium transition-colors text-sm tracking-wide">{t.nav.benefits}</a>
            <a href="#ingredients" className="text-stone-700 hover:text-emerald-800 font-medium transition-colors text-sm tracking-wide">{t.nav.ingredients}</a>
            <a href="#reviews" className="text-stone-700 hover:text-emerald-800 font-medium transition-colors text-sm tracking-wide">{t.nav.reviews}</a>
            
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1 rounded-full border border-stone-300 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-all uppercase"
            >
                <Globe className="w-3 h-3" />
                {lang === 'hi' ? 'EN' : 'HI'}
            </button>
            <a 
              href="#order"
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5 tracking-wide flex items-center"
            >
              {t.nav.order}
            </a>
          </div>
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLanguage} className="text-emerald-800 font-bold text-xs border px-2 py-1 rounded border-emerald-800">
                {lang === 'hi' ? 'EN' : 'HI'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-stone-700">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 absolute w-full pb-4 shadow-xl">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a href="#benefits" className="block px-3 py-2 text-stone-700 font-medium" onClick={()=>setIsOpen(false)}>{t.nav.benefits}</a>
            <a href="#ingredients" className="block px-3 py-2 text-stone-700 font-medium" onClick={()=>setIsOpen(false)}>{t.nav.ingredients}</a>
            <a href="#reviews" className="block px-3 py-2 text-stone-700 font-medium" onClick={()=>setIsOpen(false)}>{t.nav.reviews}</a>
            <a 
              href="#order" 
              className="block px-3 py-2 text-emerald-800 font-bold" 
              onClick={()=>setIsOpen(false)}
            >
              {t.nav.order} →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;