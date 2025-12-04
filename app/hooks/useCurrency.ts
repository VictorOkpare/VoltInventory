import { useEffect } from 'react';
import { useCurrencyStore } from '@/app/store/currencyStore';

export const useCurrency = () => {
  const {
    userCurrency,
    exchangeRates,
    isLoading,
    error,
    setUserCurrency,
    fetchExchangeRates,
    convertToBase,
    convertFromBase,
    getCurrencyCode,
  } = useCurrencyStore();

  useEffect(() => {
    // Fetch exchange rates on mount
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  const formatCurrency = (amount: number, currency?: string): string => {
    const currencyToUse = currency || userCurrency;
    const currencyCode = getCurrencyCode(currencyToUse);

    // Currency symbols mapping
    const symbols: { [key: string]: string } = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', INR: '₹',
      NGN: '₦', CAD: 'C$', AUD: 'A$', CHF: 'CHF', NZD: 'NZ$', ZAR: 'R',
      KRW: '₩', BRL: 'R$', MXN: 'Mex$', RUB: '₽', SGD: 'S$', HKD: 'HK$',
      SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł', THB: '฿', IDR: 'Rp',
      MYR: 'RM', PHP: '₱', TRY: '₺', AED: 'د.إ', SAR: '﷼', EGP: '£',
    };

    const symbol = symbols[currencyCode] || currencyCode;
    
    return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const getCurrencySymbol = (currency?: string): string => {
    const currencyToUse = currency || userCurrency;
    const currencyCode = getCurrencyCode(currencyToUse);

    const symbols: { [key: string]: string } = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', INR: '₹',
      NGN: '₦', CAD: 'C$', AUD: 'A$', CHF: 'CHF', NZD: 'NZ$', ZAR: 'R',
      KRW: '₩', BRL: 'R$', MXN: 'Mex$', RUB: '₽', SGD: 'S$', HKD: 'HK$',
      SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł', THB: '฿', IDR: 'Rp',
      MYR: 'RM', PHP: '₱', TRY: '₺', AED: 'د.إ', SAR: '﷼', EGP: '£',
    };

    return symbols[currencyCode] || currencyCode;
  };

  return {
    userCurrency,
    exchangeRates,
    isLoading,
    error,
    setUserCurrency,
    convertToBase,
    convertFromBase,
    formatCurrency,
    getCurrencySymbol,
    getCurrencyCode,
  };
};
