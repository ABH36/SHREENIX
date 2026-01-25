// src/app/page.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Hero from '../components/Hero';
import TreatmentScope from '../components/TreatmentScope';
import Benefits from '../components/Benefits';
import Ingredients from '../components/Ingredients';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import OrderForm from '../components/OrderForm';
import Footer from '../components/Footer';
import StickyCTA from '../components/StickyCTA';

export default function Home() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <TreatmentScope />
        <Benefits />
        <Ingredients />
        <Reviews />
        <OrderForm />
        <FAQ />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}