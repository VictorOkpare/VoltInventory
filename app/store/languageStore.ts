'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'en' | 'es' | 'fr' | 'de';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: 'language-storage',
      skipHydration: true,
      partialize: (state) => ({
        locale: state.locale,
      }),
    }
  )
);
