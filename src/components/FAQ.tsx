import React from 'react';

const faqs = [
  {
    question: "Kya iska koi side-effect hai?",
    answer: "Bilkul nahi. Shreenix 100% Ayurvedic ingredients se bana hai aur dermatologically tested hai. Ye har skin type ke liye safe hai."
  },
  {
    question: "Kitne din mein asar dikhega?",
    answer: "Adhiktar logon ko pehle 3 din mein hi khujli aur jalan mein aaram milna shuru ho jata hai. Pura course 15-20 din ka hai."
  },
  {
    question: "Kya Cash on Delivery (COD) available hai?",
    answer: "Haan, hum Cash on Delivery offer karte hain. Aap product milne par paise de sakte hain."
  },
  {
    question: "Agar product kaam nahi kiya to?",
    answer: "Humein apne product par pura bharosa hai. Phir bhi agar koi dikkat ho, to hamari support team aapki madad ke liye hamesha taiyar hai."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Aam Sawal (FAQs)</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center">
                <span className="mr-2 text-xl">?</span> {faq.question}
              </h3>
              <p className="text-gray-600 pl-6 border-l-2 border-emerald-500">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;