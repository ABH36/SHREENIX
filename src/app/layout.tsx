import type { Metadata } from "next";
import { Noto_Sans_Devanagari, Playfair_Display } from "next/font/google"; 
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext"; // Import Provider

// Body text ke liye clean font
const hindiFont = Noto_Sans_Devanagari({ 
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
  variable: "--font-hindi",
});

// Headings ke liye Royal/Ayurvedic font
const serifFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Shreenix Ayurveda | Dad-Khaaj Khujli Ka Pakka Ilaaj",
  description: "Premium Ayurvedic Solution for Fungal Infections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body className={`${hindiFont.className} ${serifFont.variable} bg-[#FDFBF7] text-gray-800 antialiased`}>
        {/* Puri app ko Language Provider se wrap kiya */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}