import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TreatmentScope from '../components/TreatmentScope';
import Benefits from '../components/Benefits';
import Ingredients from '../components/Ingredients';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import OrderForm from '../components/OrderForm';
import StickyCTA from '../components/StickyCTA';
import Footer from '../components/Footer';
import Script from 'next/script';

export default function Home() {
  return (
    <main className="flex min-h-screen scroll-smooth flex-col">
      <Script id="medical-schema" type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "MedicalProduct",
          "name": "Shreenix Ayurvedic Fungal Care Cream",
          "description": "Clinically inspired ayurvedic cream for fungal infection, itching, ringworm and rashes.",
          "manufacturer": {
            "@type": "Organization",
            "name": "Shreenix Ayurveda"
          },
          "audience": {
            "@type": "PeopleAudience",
            "suggestedGender": "Unisex"
          }
        }
        `}
      </Script>

      <TopBar />
      <Navbar />

      <Hero />
      <TreatmentScope />
      <Benefits />
      <Ingredients />
      <Reviews />
      <OrderForm />
      <FAQ />
      <Footer />

      <StickyCTA />
    </main>
  );
}
