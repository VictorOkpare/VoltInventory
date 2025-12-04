import React from 'react';
import { useCurrency } from '@/app/hooks/useCurrency';
import { Info } from 'lucide-react';

export const CurrencyInfo = () => {
  const { userCurrency, getCurrencyCode } = useCurrency();
  const currencyCode = getCurrencyCode(userCurrency);

  if (currencyCode === 'NGN') {
    return null; // Don't show info if already in base currency
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
      <div className="flex items-start">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">Currency Conversion Active</p>
          <p className="text-xs mt-1">
            Prices are stored in Nigerian Naira (NGN) and displayed in {currencyCode}. 
            Exchange rates update hourly.
          </p>
        </div>
      </div>
    </div>
  );
};
