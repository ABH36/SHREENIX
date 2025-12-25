'use client'; // Zaruri hai hooks ke liye

import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { t, lang, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
             {/* Logo Icon Placeholder */}
            <div className="w-8 h-8 bg-emerald-700 rounded-tr-xl rounded-bl-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold">S</span>
            </div>
            <span className="text-2xl font-serif font-bold text-emerald-900 tracking-wide">
              SHREENIX
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors">{t.nav.benefits}</a>
            <a href="#ingredients" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors">{t.nav.ingredients}</a>
            <a href="#reviews" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors">{t.nav.reviews}</a>
            
            {/* Language Switcher Button */}
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1 rounded-full border border-emerald-200 text-emerald-800 text-sm font-medium hover:bg-emerald-50 transition-all"
            >
                <Globe className="w-4 h-4" />
                {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>

            <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5">
              {t.nav.order}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLanguage} className="text-emerald-800 font-bold text-sm">
                {lang === 'hi' ? 'EN' : 'HI'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-stone-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#FDFBF7] border-t border-stone-200 absolute w-full pb-4 shadow-xl">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a href="#benefits" className="block px-3 py-2 text-stone-700 font-medium" onClick={()=>setIsOpen(false)}>{t.nav.benefits}</a>
            <a href="#ingredients" className="block px-3 py-2 text-stone-700 font-medium" onClick={()=>setIsOpen(false)}>{t.nav.ingredients}</a>
            <a href="#reviews" className="block px-3 py-2 text-stone-700 font-medium" onClick={()=>setIsOpen(false)}>{t.nav.reviews}</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;