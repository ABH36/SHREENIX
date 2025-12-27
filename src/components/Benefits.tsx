'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Leaf, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const icons = [Clock, Leaf, ShieldCheck, AlertCircle];

const Benefits = () => {
  const { t } = useLanguage();

  return (
    <section id="benefits" className="bg-[#F6F3EC] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-[0.3em] text-[#1C6B4A]">
            {t.benefits.heading}
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-4 font-serif text-3xl md:text-4xl text-[#102820]">
            {t.benefits.subHeading}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefits.items.map((benefit, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="group flex flex-col items-center rounded-[28px] border border-[#AEE4C2] bg-white/80 backdrop-blur-xl p-10 text-center shadow-lg transition-all hover:shadow-2xl"
              >
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#AEE4C2] text-[#1C6B4A] transition-all duration-300 group-hover:bg-[#1C6B4A] group-hover:text-white">
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="mb-3 font-serif text-xl text-[#102820]">
                  {benefit.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#102820]/65">
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
