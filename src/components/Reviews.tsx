'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();

        if (data?.success && data?.reviews?.length) {
          setReviews(data.reviews);
        } else {
          setReviews([
            { _id: '1', name: 'Rahul V.', location: 'Indore', rating: 5, comment: 'Shreenix best hai! 3 din me aaram mil gaya.' },
            { _id: '2', name: 'Priya S.', location: 'Mumbai', rating: 5, comment: 'Packaging achi hai aur delivery fast thi.' },
            { _id: '3', name: 'Amit K.', location: 'Delhi', rating: 4, comment: 'Product thoda mehnga hai par asar karta hai.' }
          ]);
        }
      } catch (error) {
        console.error('Review fetch failed');
      }
    };

    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700"
          >
            <Star size={14} fill="currentColor" /> Customer Love
          </motion.div>

          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl font-serif">
            Real Stories, Real Relief
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            See why 10,000+ people trust Shreenix for their skin health.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative rounded-3xl border border-stone-100 bg-stone-50 p-8 transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute right-8 top-6 text-emerald-100 transition-colors group-hover:text-emerald-200">
                <Quote size={40} fill="currentColor" />
              </div>

              <div className="mb-6 flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="mb-8 text-lg font-medium leading-relaxed text-gray-700">
                "{review.comment}"
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800 text-xl font-bold uppercase text-white">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-emerald-600">
                    <User size={12} /> {review.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
