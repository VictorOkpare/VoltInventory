'use client';

import React from 'react';
import { useLanguageStore } from '@/app/store/languageStore';
import { useTranslations } from '@/app/hooks/useTranslations';

interface LanguageSelectorProps {
  className?: string;
}

const languages = [
  { code: 'en', name: 'English (United States)', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish (España)', flag: '🇪🇸' },
  { code: 'fr', name: 'French (France)', flag: '🇫🇷' },
  { code: 'de', name: 'German (Deutschland)', flag: '🇩🇪' },
] as const;

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { t } = useTranslations();
  const { locale, setLocale } = useLanguageStore();

  const handleChange = (value: string) => {
    setLocale(value as 'en' | 'es' | 'fr' | 'de');
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-royal-blue dark:text-gray-300 mb-2">
        {t('components.languageSelector.label')}
      </label>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {t('components.languageSelector.description')}
      </p>
    </div>
  );
}
