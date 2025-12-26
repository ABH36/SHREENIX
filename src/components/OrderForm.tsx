'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, MapPin, Phone, User, AlertCircle, ShoppingBag, TicketPercent, X } from 'lucide-react';
import Image from 'next/image';

const OrderForm = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [productImage, setProductImage] = useState('/hero-product.png'); // Default Image
  const [deliveryRules, setDeliveryRules] = useState<any>({ allowedStates: [], allowedPincodes: [] });
  const [errorMsg, setErrorMsg] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, amount: number} | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  useEffect(() => {
    fetch('/api/admin/product')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.product) {
          const fetchedVariants = data.product.variants || [];
          setVariants(fetchedVariants);
          setDeliveryRules(data.product.deliveryRules || { allowedStates: [], allowedPincodes: [] });
          if(fetchedVariants.length > 0) setSelectedVariant(fetchedVariants[0]);
          if(data.product.heroImages && data.product.heroImages.length > 0) {
              setProductImage(data.product.heroImages[0]);
          }
        }
      })
      .catch(err => console.error("Error loading product"));
  }, []);

  if (!t || !t.checkout) return null;

  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', city: '', pincode: '', state: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg(''); 
  };

  const handleApplyCoupon = async () => {
      if(!couponCode) return;
      setVerifyingCoupon(true);
      setCouponMsg('');
      try {
          const res = await fetch('/api/coupon/verify', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ code: couponCode })
          });
          const data = await res.json();
          if(data.success) {
              setAppliedCoupon({ code: data.code, amount: data.discount });
              setCouponMsg(`Success! ₹${data.discount} Saved.`);
          } else {
              setAppliedCoupon(null);
              setCouponMsg(data.message || 'Invalid Coupon');
          }
      } catch (err) { setCouponMsg('Error verifying coupon'); }
      setVerifyingCoupon(false);
  };

  const removeCoupon = () => {
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponMsg('');
  };

  const basePrice = selectedVariant?.price || 0;
  const discount = appliedCoupon ? appliedCoupon.amount : 0;
  const finalPrice = Math.max(0, basePrice - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (deliveryRules.allowedPincodes && deliveryRules.allowedPincodes.length > 0) {
        if (!deliveryRules.allowedPincodes.includes(formData.pincode.trim())) {
            setErrorMsg(`Sorry, delivery not available in: ${formData.pincode}`);
            setLoading(false);
            return;
        }
    }

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: 1,
          amount: finalPrice, 
          productName: `Shreenix (${selectedVariant?.weight})${appliedCoupon ? ` [Cpn: ${appliedCoupon.code}]` : ''}`
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', phone: '', address: '', city: '', pincode: '', state: '' });
        setAppliedCoupon(null);
      } else {
        alert("Something went wrong.");
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };
  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-stone-50 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all shadow-sm";

  return (
    <section id="order" className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
           <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-2">{t.checkout.heading}</h2>
           <p className="text-stone-500">{t.checkout.subHeading}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
          
          <div className="lg:w-1/3 bg-emerald-900 text-white p-8 lg:p-10 flex flex-col relative overflow-hidden">
            
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10">
                
                <div className="flex justify-center mb-8">
                    <div className="relative w-40 h-40 bg-white/10 rounded-full p-4 border border-emerald-500/30 shadow-inner">
                        <Image 
                            src={productImage} 
                            alt="Selected Product" 
                            fill 
                            className="object-contain p-2 drop-shadow-xl"
                            onError={(e: any) => e.target.src = '/hero-product.png'}
                        />
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-emerald-700 pb-2">
                    <ShoppingBag size={20}/> Select Size
                </h3>
                <div className="space-y-3 mb-8">
                    {(!variants || variants.length === 0) ? (
                        <div className="text-emerald-300 text-sm">Loading options...</div>
                    ) : (
                        variants.map((v, idx) => (
                            <div key={idx} onClick={() => setSelectedVariant(v)}
                                className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                                    selectedVariant?.weight === v.weight ? 'bg-white text-emerald-900 shadow-lg scale-105' : 'bg-emerald-800/40 border-emerald-700 text-emerald-100 hover:bg-emerald-800'
                                }`}
                            >
                                <span className="font-bold">{v.weight}</span>
                                <div className="text-right">
                                    <span className="font-bold block">₹{v.price}</span>
                                    {v.mrp > v.price && <span className="text-xs opacity-60 line-through">₹{v.mrp}</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mb-6 bg-emerald-800/50 p-4 rounded-xl border border-emerald-700/50">
                    <h4 className="text-sm font-bold text-emerald-200 mb-2 flex items-center gap-2">
                        <TicketPercent size={16}/> Have a Coupon?
                    </h4>
                    {!appliedCoupon ? (
                        <div className="flex gap-2">
                            <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="CODE" className="w-full bg-emerald-900/50 border border-emerald-600 rounded-lg px-3 py-2 text-sm text-white uppercase outline-none placeholder:text-emerald-400" />
                            <button onClick={handleApplyCoupon} disabled={verifyingCoupon || !couponCode} className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-3 py-2 rounded-lg text-sm">Apply</button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
                            <span className="text-emerald-300 font-bold text-sm">{appliedCoupon.code} Applied!</span>
                            <button onClick={removeCoupon}><X size={16} className="text-emerald-200 hover:text-white"/></button>
                        </div>
                    )}
                    {couponMsg && <p className={`text-xs mt-2 ${appliedCoupon ? 'text-green-300' : 'text-red-300'}`}>{couponMsg}</p>}
                </div>
                {selectedVariant && (
                    <div className="space-y-2 text-sm text-emerald-200 border-t border-emerald-700 pt-4">
                        <div className="flex justify-between"><span>Price</span><span>₹{basePrice}</span></div>
                        {appliedCoupon && <div className="flex justify-between text-green-300 font-bold"><span>Discount</span><span>- ₹{discount}</span></div>}
                        <div className="flex justify-between font-bold text-white text-xl mt-2 pt-2 border-t border-emerald-700">
                            <span>Total Pay</span><span>₹{finalPrice}</span>
                        </div>
                    </div>
                )}
             </div>
          </div>

          <div className="lg:w-2/3 p-8 lg:p-12 relative">
             <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold text-emerald-900">Order Placed Successfully!</h3>
                        <p className="text-gray-500 mt-2">We will contact you shortly.</p>
                        <button onClick={() => setSuccess(false)} className="mt-8 text-emerald-600 font-bold underline">Place Another Order</button>
                    </motion.div>
                )}
             </AnimatePresence>

             <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold flex gap-2"><AlertCircle size={18}/> {errorMsg}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className={inputClass} />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input type="tel" name="phone" required maxLength={10} value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
                    </div>

                    <div className="md:col-span-2 relative">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Full Address (House No, Street, Landmark)" className={inputClass} />
                    </div>

                    <div className="relative">
                         <input type="text" name="pincode" required maxLength={6} value={formData.pincode} onChange={handleChange} placeholder="Pincode (e.g. 452001)" className={inputClass} />
                    </div>

              
                    <div className="relative">
                        <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="City / Village" className={inputClass} />
                    </div>

              
                    <div className="relative">
                        <input type="text" name="state" required value={formData.state} onChange={handleChange} placeholder="State" className={inputClass} />
                    </div>
                </div>

                <button type="submit" disabled={loading || !selectedVariant} className="w-full bg-emerald-800 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed transition-colors">
                  {loading ? <Loader2 className="animate-spin" /> : `Confirm Order - ₹${finalPrice}`}
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <CheckCircle size={12}/> 100% Safe & Secure Payment on Delivery
                </p>
             </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;