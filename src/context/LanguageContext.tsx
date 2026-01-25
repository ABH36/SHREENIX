'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { content } from '../lib/content';

type Language = 'hi' | 'en';
type Translation = typeof content.hi;

interface LanguageContextType {
  currentLang: Language;
  lang: Language; // For backward compatibility
  t: Translation;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>('hi');

  // Load saved language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('shreenix_lang') as Language;
    if (savedLang && (savedLang === 'hi' || savedLang === 'en')) {
      setCurrentLang(savedLang);
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('shreenix_lang', currentLang);
    // Update HTML lang attribute for SEO and accessibility
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
  };

  const t = content[currentLang];
  const isRTL = currentLang === 'hi' || currentLang === 'en';

  return (
    <LanguageContext.Provider value={{ 
      currentLang, 
      lang: currentLang, // Backward compatibility
      t, 
      toggleLanguage, 
      setLanguage,
      isRTL 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper function to get language direction
export function useLanguageDirection() {
  const { currentLang } = useLanguage();
  return currentLang === 'hi' ? 'rtl' : 'ltr';
}

// Helper hook for conditional styling based on language
export function useLanguageStyles() {
  const { currentLang } = useLanguage();
  
  return {
    // Font classes based on language
    fontClass: currentLang === 'hi' ? 'font-hindi' : 'font-sans',
    
    // Text alignment
    textAlign: currentLang === 'hi' ? 'text-right' : 'text-left',
    
    // Direction
    direction: currentLang === 'hi' ? 'rtl' : 'ltr',
    
    // Specific styles for Hindi
    isHindi: currentLang === 'hi',
    
    // Specific styles for English
    isEnglish: currentLang === 'en',
  };
}