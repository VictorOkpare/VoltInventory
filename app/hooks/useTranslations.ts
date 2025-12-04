'use client';

import { useLanguageStore } from '@/app/store/languageStore';
import { useEffect, useState } from 'react';

type Messages = Record<string, any>;

export function useTranslations() {
  const { locale } = useLanguageStore();
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      setIsLoading(true);
      try {
        const msgs = await import(`@/messages/${locale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        // Fallback to English
        const msgs = await import('@/messages/en.json');
        setMessages(msgs.default);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale, isLoading };
}
