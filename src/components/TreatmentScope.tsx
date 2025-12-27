'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const TreatmentScope = () => {
  const { t } = useLanguage();
  const [treatmentImages, setTreatmentImages] = useState([
    '/problem-1.png', 
    '/problem-2.png', 
    '/problem-3.png'
  ]);
  useEffect(() => {
    fetch('/api/admin/product')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.product && data.product.treatmentImages && data.product.treatmentImages.length > 0) {
            const newImages = [...data.product.treatmentImages];
            if(!newImages[0]) newImages[0] = '/problem-1.png';
            if(!newImages[1]) newImages[1] = '/problem-2.png';
            if(!newImages[2]) newImages[2] = '/problem-3.png';
            
            setTreatmentImages(newImages);
        }
      })
      .catch(err => console.log("Treatment images load error"));
  }, []);

  if (!t || !t.treatment) return null;
  const problemsList = [
    { 
      img: treatmentImages[0], 
      ...t.treatment.problems[0] 
    },
    { 
      img: treatmentImages[1], 
      ...t.treatment.problems[1] 
    },
    { 
      img: treatmentImages[2], 
      ...t.treatment.problems[2] 
    }
  ];

  return (
    <section className="relative overflow-hidden bg-[#F6F3EC] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100/40 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700">
            <AlertCircle size={14} /> Fungal Alert
          </motion.div>

          <h2 className="mb-3 text-3xl md:text-4xl font-serif text-[#102820]">
            {t.treatment.heading}
          </h2>
          <p className="text-[#102820]/70">{t.treatment.subHeading}</p>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-3">
          {problemsList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 }}
              className="group relative overflow-hidden rounded-3xl border border-[#AEE4C2] bg-white/80 backdrop-blur-xl transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-64 w-full overflow-hidden bg-[#AEE4C2]/30 flex items-center justify-center">
                <span className="absolute right-5 top-5 h-3 w-3 rounded-full bg-red-500 animate-ping" />
                <span className="absolute right-5 top-5 h-3 w-3 rounded-full bg-red-500" />
                <img 
                    src={item.img} 
                    alt={item.title} 
                    className="h-44 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110" 
                    onError={(e: any) => { e.target.src = '/problem-1.png' }} 
                />
              </div>

              <div className="p-7">
                <h3 className="mb-2 text-xl font-semibold text-[#102820] group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#102820]/60">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-10 rounded-[32px] border border-[#AEE4C2] bg-gradient-to-r from-[#AEE4C2]/40 to-[#F6F3EC] p-8 md:flex-row md:p-14">

          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-serif text-[#102820]">
              {t.treatment.resultBox.title}
            </h3>

            <p className="max-w-md text-[#102820]/70">
              Shreenix Cream का असर सिर्फ 3–5 दिनों में दिखाई देने लगता है। यह त्वचा को रिपेयर करती है और पुराने निशान मिटाती है।
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-4 md:justify-start">
              <span className="flex items-center gap-1 rounded-xl bg-white px-4 py-1.5 text-xs font-bold text-[#1C6B4A] shadow">
                <CheckCircle2 size={14} /> Clinical Proven
              </span>
              <span className="flex items-center gap-1 rounded-xl bg-white px-4 py-1.5 text-xs font-bold text-[#1C6B4A] shadow">
                <CheckCircle2 size={14} /> No Marks Left
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-lg flex-1 items-center justify-center">
            <div className="relative flex aspect-video w-full overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl">

              <div className="relative flex w-1/2 items-center justify-center bg-red-100/40 border-r border-white">
                <span className="absolute left-3 top-3 rounded bg-red-200 px-2 py-0.5 text-[10px] font-bold text-red-600">
                  {t.treatment.resultBox.before}
                </span>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-200/60">
                  <AlertCircle className="text-red-400 opacity-60" />
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md">
                <ArrowRight size={16} className="text-[#1C6B4A]" />
              </div>

              <div className="relative flex w-1/2 items-center justify-center bg-[#AEE4C2]/40">
                <span className="absolute right-3 top-3 rounded bg-[#AEE4C2] px-2 py-0.5 text-[10px] font-bold text-[#1C6B4A]">
                  {t.treatment.resultBox.after}
                </span>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#AEE4C2]/60">
                  <CheckCircle2 className="text-[#1C6B4A] opacity-60" />
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