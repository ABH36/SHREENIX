'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const colors = ['bg-green-100', 'bg-emerald-100', 'bg-amber-100', 'bg-blue-100'];
const emojis = ['🌿', '🌱', '🟠', '🧊'];

const Ingredients = () => {
  const { t } = useLanguage();

  return (
    <section id="ingredients" className="bg-[#F5F2EB] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-2 text-sm font-bold uppercase tracking-widest text-emerald-700"
          >
            {t.ingredients.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl font-bold text-gray-900 md:text-5xl"
          >
            {t.ingredients.subHeading}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.ingredients.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-stone-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute left-0 top-0 h-2 w-full bg-emerald-600 opacity-0 transition-opacity group-hover:opacity-100" />

              <div
                className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-inner ${colors[index]}`}
              >
                {emojis[index]}
              </div>

              <h3 className="mb-2 font-serif text-xl font-bold text-gray-900">
                {item.name}
              </h3>

              <span className="mb-4 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                {item.role}
              </span>

              <p className="text-sm leading-relaxed text-stone-500">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Ingredients;
