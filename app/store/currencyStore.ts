'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyState {
  baseCurrency: string; // Always NGN
  userCurrency: string; // User's selected currency
  exchangeRates: ExchangeRates;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  setUserCurrency: (currency: string) => void;
  fetchExchangeRates: () => Promise<void>;
  convertToBase: (amount: number, fromCurrency: string) => number;
  convertFromBase: (amount: number, toCurrency: string) => number;
  getCurrencyCode: (fullCurrency: string) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      baseCurrency: 'NGN',
      userCurrency: 'NGN - Nigerian Naira',
      exchangeRates: {},
      isLoading: false,
      error: null,
      lastUpdated: null,

      setUserCurrency: (currency: string) => {
        set({ userCurrency: currency });
        // Fetch new rates when currency changes
        get().fetchExchangeRates();
      },

      getCurrencyCode: (fullCurrency: string) => {
        // Extract currency code from "USD - US Dollar" format
        return fullCurrency.split(' - ')[0] || 'NGN';
      },

      fetchExchangeRates: async () => {
        const { lastUpdated } = get();
        const now = Date.now();
        
        // Cache rates for 1 hour
        if (lastUpdated && now - lastUpdated < 3600000) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Using exchangerate-api.com which has better reliability
          const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN');
          
          if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
          }

          const data = await response.json();

          if (data.rates && typeof data.rates === 'object') {
            set({
              exchangeRates: data.rates,
              isLoading: false,
              lastUpdated: now,
              error: null,
            });
          } else {
            throw new Error('Invalid exchange rate data');
          }
        } catch (error) {
          console.error('Error fetching exchange rates:', error);
          // Set fallback rates to prevent app from breaking
          set({
            exchangeRates: {
              NGN: 1,
              USD: 0.0012,
              EUR: 0.0011,
              GBP: 0.00095,
              JPY: 0.18,
              CNY: 0.0087,
              INR: 0.10,
              CAD: 0.0017,
              AUD: 0.0018,
              CHF: 0.0011,
            },
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch rates',
          });
        }
      },

      convertToBase: (amount: number, fromCurrency: string): number => {
        const { exchangeRates, getCurrencyCode } = get();
        const currencyCode = getCurrencyCode(fromCurrency);

        if (currencyCode === 'NGN') {
          return amount;
        }

        const rate = exchangeRates[currencyCode];
        if (!rate) {
          console.warn(`No exchange rate found for ${currencyCode}, using amount as is`);
          return amount;
        }

        // Convert from user currency to NGN
        return amount / rate;
      },

      convertFromBase: (amount: number, toCurrency: string): number => {
        const { exchangeRates, getCurrencyCode } = get();
        const currencyCode = getCurrencyCode(toCurrency);

        if (currencyCode === 'NGN') {
          return amount;
        }

        const rate = exchangeRates[currencyCode];
        if (!rate) {
          console.warn(`No exchange rate found for ${currencyCode}, returning NGN value`);
          return amount;
        }

        // Convert from NGN to user currency
        return amount * rate;
      },
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({
        userCurrency: state.userCurrency,
        exchangeRates: state.exchangeRates,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
