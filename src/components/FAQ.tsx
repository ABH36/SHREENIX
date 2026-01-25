'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  if (!t || !t.faq) return null;

  return (
    <section id="faq" className="relative bg-gradient-to-b from-[#102820] to-[#1C6B4A] py-28 text-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-300 rounded-full filter blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20"
          >
            <HelpCircle size={14} />
            Common Questions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl text-white"
          >
            {t.faq.heading}
          </motion.h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-5">
          {t.faq.items.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`
                  overflow-hidden rounded-2xl border backdrop-blur-xl
                  transition-all duration-300
                  ${isActive 
                    ? 'border-[#D4AF37] bg-white/15 shadow-xl' 
                    : 'border-white/20 bg-white/10 hover:bg-white/15'
                  }
                `}
              >
                <button
                  onClick={() => setActiveIndex(isActive ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left group"
                >
                  <span className={`
                    pr-4 font-serif text-lg transition-colors
                    ${isActive ? 'text-[#D4AF37]' : 'text-white group-hover:text-[#D4AF37]'}
                  `}>
                    {item.q}
                  </span>

                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      transition-colors
                      ${isActive 
                        ? 'bg-[#D4AF37] text-[#102820]' 
                        : 'bg-white/10 text-[#D4AF37]'
                      }
                    `}
                  >
                    {isActive ? <Minus size={18} /> : <Plus size={18} />}
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-white/20 px-6 pb-6 pt-4 text-white/80 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">Still have questions?</p>
          <a
            href="#order"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#102820] rounded-full font-bold transition-all shadow-xl hover:shadow-2xl"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}