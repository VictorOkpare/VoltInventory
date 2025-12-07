'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useEffect } from 'react';
import { useCurrencyStore } from './store/currencyStore';
import { useLanguageStore } from './store/languageStore';
import { useSettingsStore } from './store/settingsStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }), []);

  // Hydrate stores on client-side
  useEffect(() => {
    useCurrencyStore.persist.rehydrate();
    useLanguageStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
