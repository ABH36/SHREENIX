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
      } catch {}
    };

    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="overflow-hidden bg-[#F6F3EC] py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/20 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#1C6B4A]">
            <Star size={14} fill="currentColor" /> Customer Love
          </motion.div>

          <h2 className="mb-4 font-serif text-4xl md:text-5xl text-[#102820]">
            Real Stories, Real Relief
          </h2>
          <p className="mx-auto max-w-2xl text-[#102820]/65">
            See why 10,000+ people trust Shreenix for their skin health.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 }}
              whileHover={{ y: -12 }}
              className="group relative rounded-[32px] border border-[#AEE4C2] bg-white/80 backdrop-blur-xl p-10 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute right-10 top-8 text-[#AEE4C2] group-hover:text-[#5FA777] transition-colors">
                <Quote size={44} fill="currentColor" />
              </div>

              <div className="mb-6 flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              <p className="mb-10 text-lg leading-relaxed text-[#102820]/80">
                "{review.comment}"
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1C6B4A] to-[#5FA777] text-lg font-bold uppercase text-white shadow">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-[#102820]">{review.name}</h4>
                  <p className="flex items-center gap-1 text-xs uppercase tracking-wider text-[#1C6B4A]">
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
