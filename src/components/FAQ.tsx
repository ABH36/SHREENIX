'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-emerald-900 py-20 text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-emerald-50">
            {t.faq.heading}
          </h2>
        </div>

        <div className="space-y-4">
          {t.faq.items.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-emerald-700 bg-emerald-800/50"
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className="pr-4 font-serif text-lg font-medium text-emerald-50">
                  {item.q}
                </span>
                {activeIndex === index ? (
                  <Minus className="flex-shrink-0 text-emerald-300" />
                ) : (
                  <Plus className="flex-shrink-0 text-emerald-300" />
                )}
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mt-2 border-t border-emerald-700/50 p-5 pt-0 font-sans leading-relaxed text-emerald-100/80">
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
