'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CurrencySelector from '@/app/components/CurrencySelector';
import LogoutButton from '@/app/components/LogoutButton';
import CategoryModal from '@/app/components/CategoryModal';
import ItemsPerPage from '@/app/components/ItemsPerPage';
import LanguageSelector from '@/app/components/LanguageSelector';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { useCurrency } from '@/app/hooks/useCurrency';
import { useTranslations } from '@/app/hooks/useTranslations';

interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

interface SettingsResponse {
  success: boolean;
  settings: {
    defaultCurrency: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUserCurrency } = useCurrency();
  const { t } = useTranslations();
  const [defaultCurrency, setDefaultCurrency] = useState('USD - US Dollar');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [autoGenerateSKU, setAutoGenerateSKU] = useState(true);
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Fetch user settings
  const { data: settingsData } = useQuery<SettingsResponse>({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('/api/auth/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update settings when data is loaded
  React.useEffect(() => {
    if (settingsData?.settings?.defaultCurrency) {
      setDefaultCurrency(settingsData.settings.defaultCurrency);
      setUserCurrency(settingsData.settings.defaultCurrency); // Sync with Zustand store
    }
  }, [settingsData, setUserCurrency]);

  // Update currency mutation
  const { mutate: saveCurrency } = useMutation({
    mutationFn: async (currency: string) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put('/api/auth/settings', 
        { defaultCurrency: currency },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });

  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    setDefaultCurrency(currency);
    setUserCurrency(currency); // Update Zustand store
    saveCurrency(currency);
  };

  // Fetch categories
  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('/api/inventory/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  // Update categories mutation
  const { mutate: updateCategories, isPending } = useMutation({
    mutationFn: async (categories: string[]) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put('/api/inventory/categories', 
        { categories },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowCategoryModal(false);
    },
  });

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Exporting data...');
  };

  const handleImportData = () => {
    // TODO: Implement import functionality
    console.log('Importing data...');
  };

  const handleUpdateCategory = () => {
    setShowCategoryModal(true);
  };

  const handleSaveCategories = (categories: string[]) => {
    updateCategories(categories);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t('settings.title')}
        </h1>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-royal-blue dark:text-white mb-6">
            {t('settings.general')}
          </h2>

          <div className="space-y-6">
            {/* Default Currency & Low Stock Threshold */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CurrencySelector 
                value={defaultCurrency}
                onChange={handleCurrencyChange}
              />

              <div>
                <label className="block text-sm font-medium text-royal-blue dark:text-gray-300 mb-2">
                  {t('settings.lowStockThreshold')}
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Auto-Generate SKU */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-royal-blue dark:text-white">
                    {t('settings.autoGenerateSKU')}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('settings.autoGenerateSKUDescription')}
                  </p>
                </div>
                <button
                  onClick={() => setAutoGenerateSKU(!autoGenerateSKU)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoGenerateSKU ? 'bg-[#162660]' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoGenerateSKU ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Update Category Button */}
            <div>
              <button
                onClick={handleUpdateCategory}
                className="px-6 py-2.5 bg-royal-blue hover:bg-royal-blue/90 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                {t('settings.updateCategory')}
              </button>
            </div>
          </div>
        </div>

        {/* Appearance & Localization */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-[#162660] dark:text-white mb-6">
            {t('settings.appearance')}
          </h2>

          <div className="space-y-6">
            {/* Language & Date Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LanguageSelector />

              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  {t('settings.dateFormat')}
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                >
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            {/* Items Per Page */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ItemsPerPage />

              {/* Theme Toggle */}
              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  {t('settings.theme')}
                </label>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.themeDescription')}
                    </p>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-[#162660] dark:text-white mb-6">
            {t('settings.dataManagement')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Data */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#162660] dark:text-white mb-2">
                  {t('settings.exportData')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.exportDescription')}
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="w-full px-4 py-2.5 bg-[#D0E6FD] hover:bg-[#D0E6FD]/80 text-[#162660] font-medium rounded-lg transition-all flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('settings.exportData')}
              </button>
            </div>

            {/* Import Data */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#162660] dark:text-white mb-2">
                  {t('settings.importData')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.importDescription')}
                </p>
              </div>
              <button
                onClick={handleImportData}
                className="w-full px-4 py-2.5 bg-[#D0E6FD] hover:bg-[#D0E6FD]/80 text-[#162660] font-medium rounded-lg transition-all flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {t('settings.importData')}
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#162660] dark:text-white mb-1">
                {t('settings.signOut')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('settings.logoutDescription')}
              </p>
            </div>
            <div className="w-auto">
              <LogoutButton className="w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Update Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categoriesData?.categories || []}
        onSave={handleSaveCategories}
        isPending={isPending}
      />
    </div>
  );
}