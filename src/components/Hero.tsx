'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Star, ShieldCheck, Leaf, Zap, Droplets } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productImages, setProductImages] = useState([
    { id: 1, src: '/hero-product.png', alt: 'Default Product' }
  ]);

  useEffect(() => {
    fetch('/api/admin/product')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.product && data.product.heroImages && data.product.heroImages.length > 0) {
          const dynamicImages = data.product.heroImages.map((url: string, idx: number) => ({
            id: idx,
            src: url,
            alt: `Shreenix View ${idx + 1}`
          }));
          setProductImages(dynamicImages);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [productImages]);

  const float = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: easeInOut }
    }
  };

  if (!t || !t.hero) return null;

  return (
    <section className="relative min-h-screen flex flex-col bg-[#F6F3EC]">
      <div className="relative pt-32 pb-14 w-full min-h-[65vh] bg-gradient-to-b from-[#AEE4C2]/40 to-[#F6F3EC] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#5FA77730,transparent_65%)]"></div>

        <div className="relative w-full max-w-7xl mx-auto px-6 flex justify-between items-center z-10 h-full">
          <div className="hidden lg:flex flex-col gap-6 w-1/4 items-end">
            <motion.div variants={float} animate="animate" className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-md border border-[#AEE4C2] flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="p-2 bg-[#AEE4C2] rounded-full text-[#1C6B4A]"><Leaf size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Main Ingredient</p>
                <p className="text-sm font-bold text-[#102820]">Pure Neem Oil</p>
              </div>
            </motion.div>

            <motion.div variants={float} animate="animate" transition={{ delay: 0.5 }} className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-md border border-[#AEE4C2] flex items-center gap-3 mr-8 hover:scale-105 transition-transform">
              <div className="p-2 bg-[#AEE4C2] rounded-full text-[#1C6B4A]"><Droplets size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Extract</p>
                <p className="text-sm font-bold text-[#102820]">Tulsi & Turmeric</p>
              </div>
            </motion.div>
          </div>

          <div className="relative w-full lg:w-1/2 h-[360px] md:h-[460px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image 
                  src={productImages[currentIndex].src}
                  alt={productImages[currentIndex].alt}
                  fill
                  className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
                  priority
                  onError={(e: any) => { e.target.src = '/hero-product.png'; }}
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {productImages.map((_, idx) => (
                <div key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? 'w-8 bg-[#1C6B4A]' : 'w-2 bg-[#AEE4C2]'}`} />
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-6 w-1/4 items-start">
            <motion.div variants={float} animate="animate" transition={{ delay: 0.2 }} className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-md border border-[#AEE4C2] flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="p-2 bg-[#AEE4C2] rounded-full text-[#1C6B4A]"><Zap size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Fast Action</p>
                <p className="text-sm font-bold text-[#102820]">Results in 3 Days</p>
              </div>
            </motion.div>

            <motion.div variants={float} animate="animate" transition={{ delay: 0.7 }} className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-md border border-[#AEE4C2] flex items-center gap-3 ml-8 hover:scale-105 transition-transform">
              <div className="p-2 bg-[#AEE4C2] rounded-full text-[#1C6B4A]"><ShieldCheck size={20} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Safety</p>
                <p className="text-sm font-bold text-[#102820]">AYUSH Certified</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-20 flex flex-col items-center text-center px-6 pt-10 pb-20">
        <div className="lg:hidden flex flex-wrap justify-center gap-3 mb-8">
          <span className="text-xs font-bold bg-[#AEE4C2]/40 text-[#1C6B4A] px-4 py-1.5 rounded-full border border-[#AEE4C2]">🌿 Neem & Tulsi</span>
          <span className="text-xs font-bold bg-[#AEE4C2]/40 text-[#1C6B4A] px-4 py-1.5 rounded-full border border-[#AEE4C2]">⚡ 3 Days Relief</span>
          <span className="text-xs font-bold bg-[#AEE4C2]/40 text-[#1C6B4A] px-4 py-1.5 rounded-full border border-[#AEE4C2]">🛡️ Certified</span>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#102820] leading-[1.1] mb-5">
          {t.hero.title1} <br />
          <span className="italic text-[#1C6B4A] font-light">{t.hero.title2}</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[#102820]/70 max-w-xl text-base md:text-lg leading-relaxed mb-10">
          {t.hero.desc}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-5 w-full justify-center">
          <a href="#order" className="group relative px-10 py-4 bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] text-white rounded-full shadow-2xl shadow-[#1C6B4A]/30 transition-transform hover:-translate-y-1">
            <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-lg">
              {t.hero.ctaMain} <ArrowRight size={20} />
            </span>
            <div className="absolute inset-0 bg-black/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </a>

          <a href="#benefits" className="px-10 py-4 bg-white border border-[#AEE4C2] text-[#102820] rounded-full font-medium hover:border-[#1C6B4A] hover:text-[#1C6B4A] transition-colors flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" /> {t.hero.ctaSec}
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-14 flex flex-wrap justify-center gap-10 md:gap-20 border-t border-[#AEE4C2] pt-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#102820]">10k+</p>
            <p className="text-xs uppercase tracking-wider text-[#102820]/60">Happy Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#102820]">100%</p>
            <p className="text-xs uppercase tracking-wider text-[#102820]/60">Natural</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#102820]">4.9</p>
            <p className="text-xs uppercase tracking-wider text-[#102820]/60">Rating</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
