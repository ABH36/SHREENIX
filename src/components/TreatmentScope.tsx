'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const TreatmentScope = () => {
  const { t } = useLanguage();

  if (!t.treatment) return null;

  const problemsList = [
    { img: '/problem-1.png', ...t.treatment.problems[0] },
    { img: '/problem-2.png', ...t.treatment.problems[1] },
    { img: '/problem-3.png', ...t.treatment.problems[2] }
  ];

  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-red-600"
          >
            <AlertCircle size={14} /> Fungal Alert
          </motion.div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl font-serif">
            {t.treatment.heading}
          </h2>
          <p className="text-gray-500">{t.treatment.subHeading}</p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {problemsList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-stone-50 transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-xs text-gray-400">
                  Image: {item.img}
                </div>
                <div className="absolute inset-0 bg-red-500/10 transition-colors group-hover:bg-red-500/0" />
                <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-red-500 animate-ping" />
                <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-red-500" />
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-800 transition-colors group-hover:text-red-600">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-10 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-6 md:flex-row md:p-10">

          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold text-emerald-900 font-serif">
              {t.treatment.resultBox.title}
            </h3>

            <p className="max-w-md text-emerald-700/80">
              Shreenix Cream का असर सिर्फ 3–5 दिनों में दिखाई देने लगता है। यह त्वचा को रिपेयर करती है और पुराने निशान मिटाती है।
            </p>

            <div className="mt-2 flex flex-wrap justify-center gap-3 md:justify-start">
              <span className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">
                <CheckCircle2 size={14} /> Clinical Proven
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">
                <CheckCircle2 size={14} /> No Marks Left
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-lg flex-1 items-center justify-center">
            <div className="relative flex aspect-video w-full overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">

              <div className="relative flex w-1/2 items-center justify-center bg-red-50 border-r border-white">
                <span className="absolute left-2 top-2 rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                  {t.treatment.resultBox.before}
                </span>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-200/50">
                  <AlertCircle className="text-red-400 opacity-50" />
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md">
                <ArrowRight size={16} className="text-emerald-600" />
              </div>

              <div className="relative flex w-1/2 items-center justify-center bg-emerald-50">
                <span className="absolute right-2 top-2 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {t.treatment.resultBox.after}
                </span>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-200/50">
                  <CheckCircle2 className="text-emerald-500 opacity-50" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TreatmentScope;
