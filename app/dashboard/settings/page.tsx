'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Download, Upload, Plus, X, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [defaultCurrency, setDefaultCurrency] = useState('USD - US Dollar');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [autoGenerateSKU, setAutoGenerateSKU] = useState(true);
  const [language, setLanguage] = useState('English (United States)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [itemsPerPage, setItemsPerPage] = useState('25');
  const [theme, setTheme] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategories, setEditingCategories] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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
      setEditingCategories([]);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/authentication/login');
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Exporting data...');
  };

  const handleImportData = () => {
    // TODO: Implement import functionality
    console.log('Importing data...');
  };

  const handleUpdateCategory = () => {
    if (categoriesData?.categories) {
      setEditingCategories([...categoriesData.categories]);
      setShowCategoryModal(true);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setEditingCategories([...editingCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (index: number) => {
    setEditingCategories(editingCategories.filter((_, i) => i !== index));
  };

  const handleSaveCategories = () => {
    updateCategories(editingCategories);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Settings
        </h1>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-[#F1E4D1] dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-[#162660] dark:text-white mb-6">
            General Settings
          </h2>

          <div className="space-y-6">
            {/* Default Currency & Low Stock Threshold */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  Default Currency
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                >
                  <option>USD - US Dollar</option>
                  <option>NGN - Nigerian Naira</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  Low Stock Threshold
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
                  <h3 className="text-sm font-medium text-[#162660] dark:text-white">
                    Auto-Generate SKU
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Automatically create a unique SKU for new items
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
                className="px-6 py-2.5 bg-[#162660] hover:bg-[#162660]/90 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                Update Category
              </button>
            </div>
          </div>
        </div>

        {/* Appearance & Localization */}
        <div className="bg-[#F1E4D1] dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-[#162660] dark:text-white mb-6">
            Appearance & Localization
          </h2>

          <div className="space-y-6">
            {/* Language & Date Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                >
                  <option>English (United States)</option>
                  <option>Spanish (España)</option>
                  <option>French (France)</option>
                  <option>German (Deutschland)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  Date Format
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
              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  Items per Page
                </label>
                <input
                  type="number"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Theme Toggle */}
              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  Theme
                </label>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Switch between light and dark mode
                    </p>
                    <button
                      onClick={() => setTheme(!theme)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        theme ? 'bg-[#162660]' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          theme ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-[#F1E4D1] dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-[#162660] dark:text-white mb-6">
            Data Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Data */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#162660] dark:text-white mb-2">
                  Export Data
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Export all your inventory data as a CSV file
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="w-full px-4 py-2.5 bg-[#D0E6FD] hover:bg-[#D0E6FD]/80 text-[#162660] font-medium rounded-lg transition-all flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>

            {/* Import Data */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#162660] dark:text-white mb-2">
                  Import Data via CSV
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Import inventory data from a CSV file
                </p>
              </div>
              <button
                onClick={handleImportData}
                className="w-full px-4 py-2.5 bg-[#D0E6FD] hover:bg-[#D0E6FD]/80 text-[#162660] font-medium rounded-lg transition-all flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-[#F1E4D1] dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#162660] dark:text-white mb-1">
                Sign Out
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Log out of your account
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Category Update Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#162660] dark:text-white">
                  Update Categories
                </h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {/* Add New Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
                  Add New Category
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    placeholder="Enter category name"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2.5 bg-[#162660] hover:bg-[#162660]/90 text-white rounded-lg transition-all flex items-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div>
                <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-3">
                  Current Categories ({editingCategories.length})
                </label>
                <div className="space-y-2">
                  {editingCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#F1E4D1] dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-[#162660] dark:text-white font-medium">
                        {category}
                      </span>
                      <button
                        onClick={() => handleRemoveCategory(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategories}
                disabled={isPending}
                className="px-6 py-2.5 bg-[#162660] hover:bg-[#162660]/90 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}