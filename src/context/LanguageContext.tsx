'use client';

import React, { createContext, useContext, useState } from 'react';
import { content } from '../lib/content';

// Type define kar rahe hain
type Language = 'hi' | 'en';
type ContentType = typeof content.hi;

interface LanguageContextType {
  lang: Language;
  t: ContentType;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('hi'); // Default Hindi

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const t = content[lang]; // Current content select karo

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}