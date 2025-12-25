'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Leaf, AlertCircle } from 'lucide-react';

const benefits = [
  {
    title: 'sirf 3 Din Mein Asar',
    description: 'Hamara advanced formula infection ko pehle din se hi rokna shuru kar deta hai.',
    icon: Clock,
  },
  {
    title: '100% Ayurvedic Formula',
    description: 'Neem, Tulsi aur Haldi ki shakti. Bina kisi harmful chemical ya steroid ke.',
    icon: Leaf,
  },
  {
    title: 'Koi Side Effect Nahi',
    description: 'Har tarah ki skin ke liye safe. Ise lagane se koi jalan ya nishan nahi padta.',
    icon: ShieldCheck,
  },
  {
    title: 'Dobara Hone Se Roke',
    description: 'Ye sirf upar se thik nahi karta, balki skin ki deep layer me jakar jad khatam karta hai.',
    icon: AlertCircle,
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-emerald-600 font-bold tracking-wide uppercase text-sm"
          >
            Kyun Chunein Shreenix?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Sirf ek cream nahi, <br />
            <span className="text-emerald-700">Pura Ayurvedic Upchaar Hai</span>
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }} // Card hover hone par upar uthega
              className="flex flex-col items-center text-center p-8 bg-stone-50 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-emerald-50"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 mb-6 shadow-inner">
                <benefit.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;