'use client';

import React from 'react';
import { useSettingsStore } from '@/app/store/settingsStore';
import { useTranslations } from '@/app/hooks/useTranslations';

interface ItemsPerPageProps {
  className?: string;
}

export default function ItemsPerPage({ className = '' }: ItemsPerPageProps) {
  const { t } = useTranslations();
  const { itemsPerPage, setItemsPerPage } = useSettingsStore();

  const handleChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
      setItemsPerPage(numValue);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-royal-blue dark:text-gray-300 mb-2">
        {t('components.itemsPerPage.label')}
      </label>
      <select
        value={itemsPerPage}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all"
      >
        <option value={10}>10 {t('components.itemsPerPage.items')}</option>
        <option value={16}>16 {t('components.itemsPerPage.items')}</option>
        <option value={25}>25 {t('components.itemsPerPage.items')}</option>
        <option value={50}>50 {t('components.itemsPerPage.items')}</option>
        <option value={100}>100 {t('components.itemsPerPage.items')}</option>
      </select>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {t('components.itemsPerPage.description')}
      </p>
    </div>
  );
}
