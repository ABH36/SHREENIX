import React from 'react';

const ingredients = [
  { name: 'Neem Oil', role: 'Anti-bacterial', color: 'bg-green-100' },
  { name: 'Tulsi Extract', role: 'Infection Fighter', color: 'bg-green-200' },
  { name: 'Haldi (Turmeric)', role: 'Skin Repair', color: 'bg-yellow-100' },
  { name: 'Kapoor', role: 'Cooling Effect', color: 'bg-blue-50' },
];

const Ingredients = () => {
  return (
    <section id="ingredients" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">Natural Ingredients</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Prakriti ki Shakti
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Shreenix bani hai un powerful jadi-butiyon se jo sadiyon se skin problems ke liye use hoti aa rahi hain.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {ingredients.map((item, index) => (
            <div key={index} className="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border border-gray-100">
              {/* Circular Placeholder for Ingredient Image */}
              <div className={`mx-auto h-24 w-24 rounded-full ${item.color} flex items-center justify-center mb-4`}>
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-emerald-600 font-medium">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ingredients;