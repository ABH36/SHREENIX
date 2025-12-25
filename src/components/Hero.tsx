'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext'; // Hook import kiya
import { CheckCircle2 } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage(); // Data fetch kiya context se

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50 to-transparent opacity-50 z-0"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-block py-2 px-4 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-6 border border-emerald-100 tracking-wider uppercase">
              {t.hero.tag}
            </span>
            
            <h1 className="text-4xl lg:text-6xl text-gray-900 leading-[1.15] mb-6 font-serif">
              {t.hero.title1} <br />
              <span className="text-emerald-800 italic relative">
                {t.hero.title2}
                {/* Underline stroke */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-400" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C2.00025 6.99997 101.5 0.999997 197.5 5.49997" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
              </span>
            </h1>
            
            <p className="text-lg text-stone-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t.hero.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#order"
                className="px-8 py-4 bg-emerald-800 text-white font-medium rounded-xl shadow-xl shadow-emerald-900/20 hover:bg-emerald-900 transition-all text-lg flex items-center justify-center gap-2"
              >
                {t.hero.ctaMain}
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#benefits"
                className="px-8 py-4 bg-white text-emerald-800 border border-emerald-100 font-medium rounded-xl hover:bg-emerald-50 transition-all text-lg shadow-sm"
              >
                {t.hero.ctaSec}
              </motion.a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-sm font-medium text-stone-500">
              {t.hero.badges.map((badge, i) => (
                <span key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" /> 
                    {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Premium Image Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-md"
          >
             <div className="relative">
                {/* Decorative Circle */}
                <div className="absolute inset-0 bg-emerald-100 rounded-full transform rotate-6 scale-90"></div>
                
                {/* Product Card */}
                <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white shadow-2xl">
                    <div className="aspect-[4/5] bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl flex items-center justify-center relative overflow-hidden">
                        <span className="text-6xl animate-bounce">🧴</span>
                        {/* Shine Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent"></div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-emerald-50 animate-bounce" style={{ animationDuration: '3s' }}>
                    <span className="text-2xl">🌿</span>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;