import React from 'react';

const StickyCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 line-through">₹999</span>
            <span className="font-bold text-lg text-emerald-800">₹499</span>
        </div>
        <a href="#order" className="flex-1 bg-emerald-700 text-white text-center font-bold py-3 rounded-lg shadow-md hover:bg-emerald-800 transition-colors">
            ORDER NOW
        </a>
      </div>
    </div>
  );
};

export default StickyCTA;