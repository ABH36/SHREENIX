'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Leaf, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const icons = [Clock, Leaf, ShieldCheck, AlertCircle];

export default function Benefits() {
  const { t } = useLanguage();

  if (!t || !t.benefits) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section id="benefits" className="relative bg-[#F6F3EC] py-24 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#AEE4C2] rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5FA777] rounded-full filter blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles size={14} />
            {t.benefits.heading}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-serif text-3xl md:text-4xl text-[#102820]"
          >
            {t.benefits.subHeading}
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {t.benefits.items.map((benefit, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -12,
                  transition: { type: 'spring', stiffness: 300 }
                }}
                className="group flex flex-col items-center rounded-[28px] border border-[#AEE4C2] bg-white/90 backdrop-blur-xl p-10 text-center shadow-lg hover:shadow-2xl transition-shadow cursor-pointer relative overflow-hidden"
              >
                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#AEE4C2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#AEE4C2] text-[#1C6B4A] transition-all duration-300 group-hover:bg-[#1C6B4A] group-hover:text-white shadow-lg"
                >
                  <Icon className="h-8 w-8" />
                </motion.div>

                {/* Title */}
                <h3 className="relative z-10 mb-3 font-serif text-xl text-[#102820] group-hover:text-[#1C6B4A] transition-colors">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-sm leading-relaxed text-[#102820]/65">
                  {benefit.desc}
                </p>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <a
            href="#order"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Experience These Benefits Now
            <ShieldCheck size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}