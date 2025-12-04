'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface Currency {
  code: string;
  name: string;
  symbol?: string;
}

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://openexchangerates.org/api/currencies.json');

        if (!response.ok) {
          throw new Error('Failed to fetch currencies');
        }

        const data = await response.json(); // { "USD": "US Dollar", "EUR": "Euro", ... }

        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid response format');
        }

        // Use ONLY data from the API for codes and names
        const currencyList: Currency[] = Object.entries(data)
          .map(([code, name]) => {
            // Optional: Derive symbol using Intl (browser-native, no external API)
            let symbol: string | undefined;
            try {
              symbol = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: code as any,
                currencyDisplay: 'symbol',
              })
                .formatToParts(0)
                .find((part) => part.type === 'currency')?.value;
            } catch {
              // Rare cases (e.g., metals or inactive codes) — omit symbol
              symbol = undefined;
            }

            return {
              code,
              name: name as string,
              symbol,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setCurrencies(currencyList);
      } catch (err) {
        console.error('Error fetching currencies:', err);
        setError(err instanceof Error ? err.message : 'Failed to load currencies');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  if (loading) {
    return (
      <div>
        <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
          Default Currency
        </label>
        <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-[#162660] dark:text-gray-400 mr-2" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading currencies...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
          Default Currency
        </label>
        <div className="w-full px-4 py-2.5 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
        Default Currency
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name} {currency.symbol ? `(${currency.symbol})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}