'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Star, ShieldCheck, Leaf, Zap, Droplets } from 'lucide-react';

interface HeroImage {
  url: string;
  publicId?: string;
  order: number;
}

export default function Hero() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productImages, setProductImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const res = await fetch('/api/admin/product');
      const data = await res.json();

      if (data.success && data.product?.heroImages?.length > 0) {
        const images = data.product.heroImages
          .sort((a: HeroImage, b: HeroImage) => a.order - b.order)
          .map((img: HeroImage) => ({
            url: img.url || '/hero-product.png',
            publicId: img.publicId,
            order: img.order
          }));
        setProductImages(images);
      } else {
        // Fallback to default images
        setProductImages([
          { url: '/hello.png', order: 0 },
          { url: '/he.png', order: 1 }
        ]);
      }
    } catch (error) {
      console.error('Hero images fetch error:', error);
      setProductImages([
        { url: '/hello.png', order: 0 },
        { url: '/he.png', order: 1 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-slide effect
  useEffect(() => {
    if (productImages.length <= 1) return;

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

  const handleImageError = () => {
    setImageError(true);
    // Fallback to default image
    setProductImages([{ url: '/hero-product.png', order: 0 }]);
  };

  if (!t || !t.hero) return null;

  return (
    <section className="relative min-h-screen flex flex-col bg-[#F6F3EC]">
      {/* Hero Background Section */}
      <div className="relative pt-32 pb-14 w-full min-h-[65vh] bg-gradient-to-b from-[#AEE4C2]/40 to-[#F6F3EC] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#5FA77730,transparent_65%)]" />

        <div className="relative w-full max-w-7xl mx-auto px-6 flex justify-between items-center z-10 h-full">
          {/* Left Benefits (Desktop) */}
          <div className="hidden lg:flex flex-col gap-6 w-1/4 items-end">
            <motion.div
              variants={float}
              animate="animate"
              className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-md border border-[#AEE4C2] flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="p-2 bg-[#AEE4C2] rounded-full text-[#1C6B4A]">
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Main Ingredient</p>
                <p className="text-sm font-bold text-[#102820]">Pure Neem Oil</p>
              </div>
            </motion.div>

            <motion.div
              variants={float}
              animate="animate"
              transition={{ delay: 0.5 }}
              className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-md border border-[#AEE4C2] flex items-center gap-3 mr-8 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="p-2 bg-[#AEE4C2] rounded-full text-[#1C6B4A]">
                <Droplets size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Extract</p>
                <p className="text-sm font-bold text-[#102820]">Tulsi & Turmeric</p>
              </div>
            </motion.div>
          </div>

          {/* Center Product Image */}
          <div className="relative w-full lg:w-1/2 h-[360px] md:h-[460px] flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1C6B4A] border-t-transparent" />
              </div>
            ) : (
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
                    src={productImages[currentIndex]?.url || '/hero-product.png'}
                    alt={`Shreenix Product ${currentIndex + 1}`}
                    fill
                    className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
                    priority={currentIndex === 0}
                    onError={handleImageError}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
            )}

            {/* Image Indicators */}
            {productImages.length > 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {productImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? 'w-8 bg-[#1C6B4A]' : 'w-2 bg-[#AEE4C2]'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Benefits (Desktop) */}
          <div className="hidden lg:flex flex-col gap-6 w-1/4 items-start">
            <motion.div
              variants={float}
              animate="animate"
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-md border border-[#AEE4C2] flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="p-2 bg-[#AEE4C2] rounded-full text-[#1C6B4A]">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Fast Action</p>
                <p className="text-sm font-bold text-[#102820]">Results in 3 Days</p>
              </div>
            </motion.div>

            <motion.div
              variants={float}
              animate="animate"
              transition={{ delay: 0.7 }}
              className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-md border border-[#AEE4C2] flex items-center gap-3 ml-8 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="p-2 bg-[#AEE4C2] rounded-full text-[#1C6B4A]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Safety</p>
                <p className="text-sm font-bold text-[#102820]">AYUSH Certified</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 relative z-20 flex flex-col items-center text-center px-6 pt-10 pb-20">
        {/* Mobile Benefits */}
        <div className="lg:hidden flex flex-wrap justify-center gap-3 mb-8">
          <span className="text-xs font-bold bg-[#AEE4C2]/40 text-[#1C6B4A] px-4 py-1.5 rounded-full border border-[#AEE4C2]">
            🌿 Neem & Tulsi
          </span>
          <span className="text-xs font-bold bg-[#AEE4C2]/40 text-[#1C6B4A] px-4 py-1.5 rounded-full border border-[#AEE4C2]">
            ⚡ 3 Days Relief
          </span>
          <span className="text-xs font-bold bg-[#AEE4C2]/40 text-[#1C6B4A] px-4 py-1.5 rounded-full border border-[#AEE4C2]">
            🛡️ Certified
          </span>
        </div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#102820] leading-[1.1] mb-5"
        >
          {t.hero.title1} <br />
          <span className="italic text-[#1C6B4A] font-light">{t.hero.title2}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[#102820]/70 max-w-xl text-base md:text-lg leading-relaxed mb-10"
        >
          {t.hero.desc}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-5 w-full justify-center"
        >
          <a
            href="#order"
            className="group relative px-10 py-4 bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] text-white rounded-full shadow-2xl shadow-[#1C6B4A]/30 transition-transform hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-lg">
              {t.hero.ctaMain} <ArrowRight size={20} />
            </span>
            <div className="absolute inset-0 bg-black/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </a>

          <a
            href="#benefits"
            className="px-10 py-4 bg-white border-2 border-[#AEE4C2] text-[#102820] rounded-full font-medium hover:border-[#1C6B4A] hover:text-[#1C6B4A] hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" /> {t.hero.ctaSec}
          </a>
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-14 flex flex-wrap justify-center gap-10 md:gap-20 border-t border-[#AEE4C2] pt-10 opacity-70 hover:opacity-100 transition-opacity duration-500"
        >
          {[
            { value: '10k+', label: 'Happy Users' },
            { value: '100%', label: 'Natural' },
            { value: '4.9', label: 'Rating' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
              className="text-center group cursor-pointer"
            >
              <p className="text-3xl font-bold text-[#102820] group-hover:text-[#1C6B4A] transition-colors">
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-wider text-[#102820]/60 mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}