'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Loader2, MapPin, Phone, User, AlertCircle,
  ShoppingBag, TicketPercent, X, Package, IndianRupee, Sparkles
} from 'lucide-react';
import Image from 'next/image';

interface Variant {
  weight: string;
  price: number;
  mrp: number;
  inStock: boolean;
}

export default function OrderForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [productImage, setProductImage] = useState('/hero-product.png');
  const [deliveryRules, setDeliveryRules] = useState<any>({
    allowedStates: [],
    allowedPincodes: []
  });
  const [errorMsg, setErrorMsg] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const res = await fetch('/api/admin/product');
      const data = await res.json();

      if (data.success && data.product) {
        const fetchedVariants = data.product.variants || [];
        setVariants(fetchedVariants);
        setDeliveryRules(data.product.deliveryRules || { allowedStates: [], allowedPincodes: [] });

        if (fetchedVariants.length > 0) {
          setSelectedVariant(fetchedVariants[0]);
        }

        // Get first hero image
        if (data.product.heroImages && data.product.heroImages.length > 0) {
          const firstImage = data.product.heroImages[0];
          setProductImage(typeof firstImage === 'string' ? firstImage : firstImage.url);
        }
      }
    } catch (error) {
      console.error('Product data fetch error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setVerifyingCoupon(true);
    setCouponMsg('');

    try {
      const res = await fetch('/api/coupon/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });

      const data = await res.json();

      if (data.success) {
        setAppliedCoupon({ code: data.code, amount: data.discount });
        setCouponMsg(`🎉 Success! ₹${data.discount} discount applied`);
      } else {
        setAppliedCoupon(null);
        setCouponMsg(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      setCouponMsg('Failed to verify coupon');
    } finally {
      setVerifyingCoupon(false);
    }
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
    setErrorMsg('');

    // Validate pincode if whitelist exists
    if (deliveryRules.allowedPincodes?.length > 0) {
      if (!deliveryRules.allowedPincodes.includes(formData.pincode.trim())) {
        setErrorMsg(`⚠️ Sorry, delivery not available in pincode: ${formData.pincode}`);
        setLoading(false);
        return;
      }
    }

    try {
      const productName = `Shreenix (${selectedVariant?.weight})${
        appliedCoupon ? ` [Coupon: ${appliedCoupon.code}]` : ''
      }`;

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: 1,
          amount: finalPrice,
          productName
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', phone: '', address: '', city: '', pincode: '', state: '' });
        setAppliedCoupon(null);
        setCouponCode('');

        // Reset success after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order submit error:', error);
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!t || !t.checkout) return null;

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-stone-50 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all shadow-sm';

  return (
    <section id="order" className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4"
          >
            <Sparkles size={16} />
            Limited Time Offer
          </motion.div>
          <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-2">
            {t.checkout.heading}
          </h2>
          <p className="text-stone-500">{t.checkout.subHeading}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
          {/* Left: Product Selection */}
          <div className="lg:w-1/3 bg-emerald-900 text-white p-8 lg:p-10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              {/* Product Image */}
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40 bg-white/10 rounded-full p-4 border border-emerald-500/30 shadow-inner">
                  <Image
                    src={productImage}
                    alt="Product"
                    fill
                    className="object-contain p-2 drop-shadow-xl"
                    onError={(e: any) => (e.target.src = '/hero-product.png')}
                  />
                </div>
              </div>

              {/* Size Selection */}
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-emerald-700 pb-2">
                <ShoppingBag size={20} /> Select Size
              </h3>

              <div className="space-y-3 mb-8">
                {variants.length === 0 ? (
                  <div className="text-emerald-300 text-sm">Loading options...</div>
                ) : (
                  variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      disabled={!v.inStock}
                      className={`w-full p-3 rounded-xl border flex justify-between items-center transition-all ${
                        selectedVariant?.weight === v.weight
                          ? 'bg-white text-emerald-900 shadow-lg scale-105'
                          : v.inStock
                          ? 'bg-emerald-800/40 border-emerald-700 text-emerald-100 hover:bg-emerald-800'
                          : 'bg-gray-700/40 border-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-bold flex items-center gap-2">
                        <Package size={16} />
                        {v.weight}
                      </span>
                      <div className="text-right">
                        <span className="font-bold block">₹{v.price}</span>
                        {v.mrp > v.price && (
                          <span className="text-xs opacity-60 line-through">₹{v.mrp}</span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Coupon Section */}
              <div className="mb-6 bg-emerald-800/50 p-4 rounded-xl border border-emerald-700/50">
                <h4 className="text-sm font-bold text-emerald-200 mb-2 flex items-center gap-2">
                  <TicketPercent size={16} /> Have a Coupon?
                </h4>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 bg-emerald-900/50 border border-emerald-600 rounded-lg px-3 py-2 text-sm text-white uppercase outline-none placeholder:text-emerald-400"
                      maxLength={20}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={verifyingCoupon || !couponCode}
                      className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      {verifyingCoupon ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
                    <span className="text-emerald-300 font-bold text-sm">
                      {appliedCoupon.code} - ₹{appliedCoupon.amount} OFF
                    </span>
                    <button onClick={removeCoupon} className="text-emerald-200 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p className={`text-xs mt-2 ${appliedCoupon ? 'text-green-300' : 'text-red-300'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Price Summary */}
              {selectedVariant && (
                <div className="space-y-2 text-sm text-emerald-200 border-t border-emerald-700 pt-4">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>₹{basePrice}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-300 font-bold">
                      <span>Coupon Discount</span>
                      <span>- ₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-white text-xl mt-2 pt-2 border-t border-emerald-700">
                    <span>Total</span>
                    <span className="flex items-center gap-1">
                      <IndianRupee size={18} />
                      {finalPrice}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Form */}
          <div className="lg:w-2/3 p-8 lg:p-12 relative">
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl"
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
                  <h3 className="text-3xl font-bold text-emerald-900 mb-2">Order Placed! 🎉</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you! We will contact you shortly to confirm.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">Order ID: #{Date.now().toString().slice(-6)}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
                  >
                    Place Another Order
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold flex gap-2 items-center"
                >
                  <AlertCircle size={18} />
                  {errorMsg}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    className={inputClass}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (10 digits) *"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2 relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full Address (House No, Street, Landmark) *"
                    className={inputClass}
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode (6 digits) *"
                    className={inputClass}
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City / Village *"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2 relative">
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State *"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedVariant}
                className="w-full bg-emerald-800 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Order - ₹{finalPrice}
                    <CheckCircle size={20} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <CheckCircle size={12} className="text-green-500" />
                100% Safe & Secure • Cash on Delivery Available
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}