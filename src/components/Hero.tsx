'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Star, ShieldCheck, Leaf, Award, Zap, Droplets } from 'lucide-react';

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
      .catch(err => console.log("Using default hero images"));
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
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
    <section className="relative min-h-screen flex flex-col bg-[#FDFBF7]">
      <div className="relative pt-28 pb-10 w-full min-h-[60vh] bg-gradient-to-b from-emerald-50/80 to-[#FDFBF7] overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[100px] z-0"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 flex justify-between items-center z-10 h-full">
            <div className="hidden lg:flex flex-col gap-6 w-1/4 items-end">
                <motion.div variants={float} animate="animate" className="bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3 w-fit hover:scale-105 transition-transform cursor-default">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-700"><Leaf size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Main Ingredient</p>
                        <p className="text-sm font-bold text-gray-800">Pure Neem Oil</p>
                    </div>
                </motion.div>

                <motion.div variants={float} animate="animate" transition={{ delay: 0.5 }} className="bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3 w-fit mr-8 hover:scale-105 transition-transform cursor-default">
                    <div className="p-2 bg-green-100 rounded-full text-green-700"><Droplets size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Extract</p>
                        <p className="text-sm font-bold text-gray-800">Tulsi & Turmeric</p>
                    </div>
                </motion.div>
            </div>
            <div className="relative w-full lg:w-1/2 h-[350px] md:h-[450px] flex items-center justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative w-full h-full"
                    >
                        <Image 
                            src={productImages[currentIndex].src} 
                            alt={productImages[currentIndex].alt}
                            fill
                            className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
                            priority
                            onError={(e: any) => { e.target.src = '/hero-product.png' }}
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {productImages.map((_, idx) => (
                        <div key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? 'w-8 bg-emerald-800' : 'w-2 bg-emerald-200'}`} />
                    ))}
                </div>
            </div>
            <div className="hidden lg:flex flex-col gap-6 w-1/4 items-start">
                <motion.div variants={float} animate="animate" transition={{ delay: 0.2 }} className="bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3 w-fit hover:scale-105 transition-transform cursor-default">
                    <div className="p-2 bg-amber-100 rounded-full text-amber-700"><Zap size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Fast Action</p>
                        <p className="text-sm font-bold text-gray-800">Results in 3 Days</p>
                    </div>
                </motion.div>

                <motion.div variants={float} animate="animate" transition={{ delay: 0.7 }} className="bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3 w-fit ml-8 hover:scale-105 transition-transform cursor-default">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-700"><ShieldCheck size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Safety</p>
                        <p className="text-sm font-bold text-gray-800">AYUSH Certified</p>
                    </div>
                </motion.div>
            </div>

        </div>
      </div>
      <div className="flex-1 relative z-20 flex flex-col items-center justify-start text-center px-4 sm:px-6 pt-6 pb-16">
        <div className="lg:hidden flex flex-wrap justify-center gap-3 mb-8">
             <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100">🌿 Neem & Tulsi</span>
             <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100">⚡ 3 Days Relief</span>
             <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100">🛡️ Certified</span>
        </div>

        <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 leading-[1.1] mb-4"
        >
            {t.hero.title1} <br />
            <span className="italic text-emerald-700 font-light">{t.hero.title2}</span>
        </motion.h1>

        <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-gray-500 max-w-xl text-base md:text-lg leading-relaxed mb-8 font-sans"
        >
            {t.hero.desc}
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
            <a 
                href="#order"
                className="group relative px-8 py-4 bg-emerald-900 text-white rounded-full overflow-hidden shadow-xl shadow-emerald-900/20 active:scale-95 transition-transform"
            >
                <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-lg">
                    {t.hero.ctaMain} <ArrowRight size={20} />
                </span>
                <div className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </a>
            
            <a 
                href="#benefits"
                className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:border-emerald-500 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {t.hero.ctaSec}
            </a>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 border-t border-gray-200 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        >
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">10k+</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">Happy Users</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">Natural</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">4.9</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">Rating</p>
            </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;