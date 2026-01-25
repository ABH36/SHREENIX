'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

const colors = ['bg-[#AEE4C2]', 'bg-[#AEE4C2]/80', 'bg-[#D4AF37]/30', 'bg-[#5FA777]/30'];
const emojis = ['🌿', '🌱', '🟠', '🧊'];

export default function Ingredients() {
  const { t } = useLanguage();

  if (!t || !t.ingredients) return null;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  return (
    <section id="ingredients" className="relative bg-[#F6F3EC] py-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-80 h-80 bg-[#1C6B4A] rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#AEE4C2] rounded-full filter blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Leaf size={14} />
            {t.ingredients.heading}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl text-[#102820]"
          >
            {t.ingredients.subHeading}
          </motion.p>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {t.ingredients.items.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -12,
                transition: { type: 'spring', stiffness: 300 }
              }}
              className="group relative overflow-hidden rounded-[32px] border border-[#AEE4C2] bg-white/90 backdrop-blur-xl p-8 text-center shadow-lg hover:shadow-2xl transition-all cursor-pointer"
            >
              {/* Top Gradient Bar */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Emoji Circle */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-inner transition-transform ${colors[index]}`}
              >
                {emojis[index]}
              </motion.div>

              {/* Name */}
              <h3 className="mb-2 font-serif text-xl text-[#102820] group-hover:text-[#1C6B4A] transition-colors">
                {item.name}
              </h3>

              {/* Role Badge */}
              <span className="mb-4 inline-block rounded-full bg-[#AEE4C2]/40 px-4 py-1.5 text-xs font-bold text-[#1C6B4A]">
                {item.role}
              </span>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[#102820]/65">
                {item.desc}
              </p>

              {/* Sparkle Effect on Hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4"
              >
                <Sparkles className="text-[#D4AF37]" size={20} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full border border-[#AEE4C2] shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-[#102820]">100% Natural</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-[#102820]">Lab Tested</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-[#102820]">AYUSH Certified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}