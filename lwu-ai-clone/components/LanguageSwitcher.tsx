'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function LanguageSwitcher({ currentLocale, onLocaleChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (locale: Locale) => {
    onLocaleChange(locale);
    setIsOpen(false);
    // Store preference in localStorage
    localStorage.setItem('preferred-locale', locale);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeFlags[currentLocale]} {localeNames[currentLocale]}</span>
        <span className="sm:hidden">{localeFlags[currentLocale]}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-40 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  locale === currentLocale
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{localeFlags[locale]}</span>
                  <span>{localeNames[locale]}</span>
                </span>
                {locale === currentLocale && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
