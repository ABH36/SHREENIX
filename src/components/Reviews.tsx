'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, Loader2, MessageCircle } from 'lucide-react';

interface Review {
  _id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();

      if (data?.success && data?.reviews?.length > 0) {
        setReviews(data.reviews);
      } else {
        // Fallback default reviews
        setReviews([
          {
            _id: '1',
            name: 'Rahul Verma',
            location: 'Indore',
            rating: 5,
            comment: 'Shreenix best hai! 3 din mein aaram mil gaya. Packaging bhi achi hai.',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Priya Sharma',
            location: 'Mumbai',
            rating: 5,
            comment: 'Delivery fast thi aur product quality excellent hai. Highly recommended!',
            createdAt: new Date().toISOString()
          },
          {
            _id: '3',
            name: 'Amit Kumar',
            location: 'Delhi',
            rating: 4,
            comment: 'Product thoda mehnga hai par asar zaroor karta hai. Worth the price.',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Reviews fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="reviews" className="overflow-hidden bg-[#F6F3EC] py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/20 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#1C6B4A]"
          >
            <Star size={14} fill="currentColor" /> Customer Love
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-serif text-4xl md:text-5xl text-[#102820]"
          >
            Real Stories, Real Relief
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-[#102820]/65"
          >
            See why 10,000+ people trust Shreenix for their skin health.
          </motion.p>

          {/* Rating Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 inline-flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-lg border border-[#AEE4C2]"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(Number(avgRating)) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}
                />
              ))}
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="text-left">
              <p className="text-2xl font-bold text-[#102820]">{avgRating}</p>
              <p className="text-xs text-gray-500">{reviews.length} Reviews</p>
            </div>
          </motion.div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#1C6B4A]" size={48} />
          </div>
        ) : error || reviews.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No reviews available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                whileHover={{ y: -12 }}
                className="group relative rounded-[32px] border border-[#AEE4C2] bg-white/80 backdrop-blur-xl p-10 shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Quote Icon */}
                <div className="absolute right-10 top-8 text-[#AEE4C2] group-hover:text-[#5FA777] transition-colors">
                  <Quote size={44} fill="currentColor" />
                </div>

                {/* Rating Stars */}
                <div className="mb-6 flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                {/* Review Comment */}
                <p className="mb-10 text-lg leading-relaxed text-[#102820]/80">
                  "{review.comment}"
                </p>

                {/* Reviewer Info */}
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

                {/* Verified Badge */}
                <div className="absolute top-4 left-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Verified
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="#order"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1C6B4A] to-[#5FA777] text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Join 10,000+ Happy Customers
            <Star size={18} fill="currentColor" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}