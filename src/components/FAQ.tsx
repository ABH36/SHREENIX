'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-gradient-to-b from-[#102820] to-[#1C6B4A] py-28 text-white">
      <div className="mx-auto max-w-3xl px-6">

        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-white">
            {t.faq.heading}
          </h2>
        </div>

        <div className="space-y-5">
          {t.faq.items.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="pr-4 font-serif text-lg text-white">
                  {item.q}
                </span>
                {activeIndex === index ? (
                  <Minus className="flex-shrink-0 text-[#D4AF37]" />
                ) : (
                  <Plus className="flex-shrink-0 text-[#D4AF37]" />
                )}
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}>
                    <div className="border-t border-white/20 p-6 pt-0 text-white/80 leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
