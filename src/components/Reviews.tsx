import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const reviews = [
  {
    name: 'Rahul Verma',
    location: 'Indore, MP',
    rating: 5,
    date: '2 Days ago',
    text: 'Maine bohot sari creams try ki thi par Shreenix ne 3 din me asar dikhaya. Khujli puri tarah band ho gayi hai. Best Ayurvedic cream!',
  },
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    date: '1 Week ago',
    text: 'Packaging bohot achi hai aur delivery bhi fast thi. Sabse achi baat ye hai ki isse koi jalan nahi hoti. Highly recommended.',
  },
  {
    name: 'Amit Kumar',
    location: 'Delhi',
    rating: 4,
    date: '3 Weeks ago',
    text: 'Product acha hai. Thoda mehenga laga pehle par result dekh kar paisa vasool hai. Dobara order karunga.',
  },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Log Kya Keh Rahe Hain?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            10,000+ Happy Customers ne hum par bharosa kiya hai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100 relative">
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              
              {/* Review Text */}
              <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
              
              {/* User Info */}
              <div className="flex items-center justify-between border-t border-emerald-200 pt-4">
                <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-xs text-gray-500">{review.location}</p>
                </div>
                <div className="flex items-center text-emerald-700 text-xs font-semibold bg-emerald-100 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;