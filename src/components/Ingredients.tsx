'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const colors = ['bg-[#AEE4C2]', 'bg-[#AEE4C2]/80', 'bg-[#D4AF37]/30', 'bg-[#5FA777]/30'];
const emojis = ['🌿', '🌱', '🟠', '🧊'];

const Ingredients = () => {
  const { t } = useLanguage();

  return (
    <section id="ingredients" className="bg-[#F6F3EC] py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#1C6B4A]">
            {t.ingredients.heading}
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-3xl md:text-5xl text-[#102820]">
            {t.ingredients.subHeading}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {t.ingredients.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              className="group relative overflow-hidden rounded-[32px] border border-[#AEE4C2] bg-white/80 backdrop-blur-xl p-8 text-center shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-inner ${colors[index]}`}>
                {emojis[index]}
              </div>

              <h3 className="mb-2 font-serif text-xl text-[#102820]">
                {item.name}
              </h3>

              <span className="mb-4 inline-block rounded-full bg-[#AEE4C2]/40 px-4 py-1.5 text-xs font-bold text-[#1C6B4A]">
                {item.role}
              </span>

              <p className="text-sm leading-relaxed text-[#102820]/65">
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
