import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import WhatsAppFloat from '../components/WhatsAppFloat';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'Shreenix Ayurveda – Trusted Ayurvedic Fungal Care',
  description: 'Clinically inspired Ayurvedic cream for fungal infection, itching, rashes & ringworm. Fast relief, safe and natural.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#F6F3EC]`}>
        <LanguageProvider>
          <main className="min-h-screen overflow-x-hidden">
            {children}
            <WhatsAppFloat />
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
