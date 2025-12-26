'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Leaf, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const icons = [Clock, Leaf, ShieldCheck, AlertCircle];

const Benefits = () => {
  const { t } = useLanguage();

  return (
    <section id="benefits" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-sm font-bold uppercase tracking-wide text-emerald-600"
          >
            {t.benefits.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 font-serif text-3xl font-bold text-gray-900 md:text-4xl"
          >
            {t.benefits.subHeading}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefits.items.map((benefit, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group flex flex-col items-center rounded-2xl border border-stone-100 bg-stone-50 p-8 text-center shadow-sm transition-all hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-700 group-hover:text-white">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </div>

                <h3 className="mb-3 font-serif text-xl font-bold text-gray-900">
                  {benefit.title}
                </h3>

                <p className="font-sans text-base leading-relaxed text-gray-600">
                  {benefit.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Benefits;
