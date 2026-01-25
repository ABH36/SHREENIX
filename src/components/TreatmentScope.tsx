'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface TreatmentImage {
  url: string;
  publicId?: string;
  order: number;
}

export default function TreatmentScope() {
  const { t } = useLanguage();
  const [treatmentImages, setTreatmentImages] = useState<string[]>([
    '/problem-1.png',
    '/problem-2.png',
    '/problem-3.png'
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreatmentImages();
  }, []);

  const fetchTreatmentImages = async () => {
    try {
      const res = await fetch('/api/admin/product');
      const data = await res.json();

      if (data.success && data.product?.treatmentImages?.length > 0) {
        const images = data.product.treatmentImages
          .sort((a: TreatmentImage, b: TreatmentImage) => a.order - b.order)
          .map((img: TreatmentImage) => img.url || '/problem-1.png');

        // Ensure we have at least 3 images with fallbacks
        const finalImages = [
          images[0] || '/problem-1.png',
          images[1] || '/problem-2.png',
          images[2] || '/problem-3.png'
        ];

        setTreatmentImages(finalImages);
      }
    } catch (error) {
      console.error('Treatment images fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!t || !t.treatment) return null;

  const problemsList = [
    { img: treatmentImages[0], ...t.treatment.problems[0] },
    { img: treatmentImages[1], ...t.treatment.problems[1] },
    { img: treatmentImages[2], ...t.treatment.problems[2] }
  ];

  return (
    <section className="relative overflow-hidden bg-[#F6F3EC] py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100/40 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700"
          >
            <AlertCircle size={14} /> Fungal Alert
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-3xl md:text-4xl font-serif text-[#102820]"
          >
            {t.treatment.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#102820]/70"
          >
            {t.treatment.subHeading}
          </motion.p>
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#1C6B4A]" size={48} />
          </div>
        ) : (
          <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-3">
            {problemsList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                className="group relative overflow-hidden rounded-3xl border border-[#AEE4C2] bg-white/80 backdrop-blur-xl transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-[#AEE4C2]/30 flex items-center justify-center">
                  <span className="absolute right-5 top-5 h-3 w-3 rounded-full bg-red-500 animate-ping" />
                  <span className="absolute right-5 top-5 h-3 w-3 rounded-full bg-red-500" />
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-44 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                    onError={(e: any) => {
                      e.target.src = '/problem-1.png';
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="mb-2 text-xl font-semibold text-[#102820] group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#102820]/60">
                    {item.desc}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Before/After Result Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-10 rounded-[32px] border border-[#AEE4C2] bg-gradient-to-r from-[#AEE4C2]/40 to-[#F6F3EC] p-8 md:flex-row md:p-14 hover:shadow-xl transition-shadow"
        >
          {/* Text Content */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-serif text-[#102820]">
              {t.treatment.resultBox.title}
            </h3>

            <p className="max-w-md text-[#102820]/70">
              Shreenix Cream का असर सिर्फ 3–5 दिनों में दिखाई देने लगता है। यह त्वचा को रिपेयर करती है और पुराने निशान मिटाती है।
            </p>

            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1 rounded-xl bg-white px-4 py-1.5 text-xs font-bold text-[#1C6B4A] shadow">
                <CheckCircle2 size={14} /> Clinical Proven
              </span>
              <span className="flex items-center gap-1 rounded-xl bg-white px-4 py-1.5 text-xs font-bold text-[#1C6B4A] shadow">
                <CheckCircle2 size={14} /> No Marks Left
              </span>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="flex w-full max-w-lg flex-1 items-center justify-center">
            <div className="relative flex aspect-video w-full overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl">
              {/* Before (Left) */}
              <div className="relative flex w-1/2 items-center justify-center bg-red-100/40 border-r border-white">
                <span className="absolute left-3 top-3 rounded bg-red-200 px-2 py-0.5 text-[10px] font-bold text-red-600">
                  {t.treatment.resultBox.before}
                </span>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-200/60">
                  <AlertCircle className="text-red-400 opacity-60" size={32} />
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md">
                <ArrowRight size={16} className="text-[#1C6B4A]" />
              </div>

              {/* After (Right) */}
              <div className="relative flex w-1/2 items-center justify-center bg-[#AEE4C2]/40">
                <span className="absolute right-3 top-3 rounded bg-[#AEE4C2] px-2 py-0.5 text-[10px] font-bold text-[#1C6B4A]">
                  {t.treatment.resultBox.after}
                </span>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#AEE4C2]/60">
                  <CheckCircle2 className="text-[#1C6B4A] opacity-60" size={32} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}