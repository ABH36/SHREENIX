import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import Ingredients from '../components/Ingredients';
import Reviews from '../components/Reviews';  // <-- New Import
import FAQ from '../components/FAQ';          // <-- New Import
import StickyCTA from '../components/StickyCTA';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col scroll-smooth">
      <Navbar />
      <Hero />
      <Benefits />
      <Ingredients />
      
      {/* Naye Sections Yahan Jode Hain 👇 */}
      <Reviews />
      <FAQ />

      {/* Simple Footer */}
      <footer className="bg-emerald-900 text-white py-10 text-center">
        <p className="text-sm opacity-80">© 2025 Shreenix Ayurveda. All rights reserved.</p>
        <p className="text-xs opacity-50 mt-2">Private & Confidential</p>
      </footer>

      <StickyCTA />
    </main>
  );
}