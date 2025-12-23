'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useCurrency } from '@/app/hooks/useCurrency';
import { useSettingsStore } from '@/app/store/settingsStore';
import { useTranslations } from '@/app/hooks/useTranslations';
import Pagination from '@/app/components/Pagination';
import EditInventoryModal from '@/app/components/EditInventoryModal';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import SuccessModal from '@/app/components/SuccessModal';

interface InventoryItem {
  _id: string;
  productName: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  sku: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryResponse {
  success: boolean;
  count: number;
  items: InventoryItem[];
}

interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

export default function InventoryPage() {
  const { t } = useTranslations();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { convertFromBase, formatCurrency, userCurrency } = useCurrency();
  const { itemsPerPage } = useSettingsStore();

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

  const categories = [t('inventory.allCategories'), ...(categoriesData?.categories || [])];

  const { data, isLoading, error } = useQuery<InventoryResponse>({
    queryKey: ['inventory'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  // Update item mutation
  const { mutateAsync: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: async (item: Omit<InventoryItem, 'userId' | 'createdAt' | 'updatedAt'>) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`/api/inventory/${item._id}`, item, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setEditingItem(null);
      setSuccessMessage(t('inventory.productUpdated'));
      setShowSuccessModal(true);
    },
  });

  // Delete item mutation
  const { mutateAsync: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: async (itemId: string) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(`/api/inventory/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setDeletingItem(null);
      setSuccessMessage(t('inventory.productDeleted'));
      setShowSuccessModal(true);
    },
  });

  const inventory = data?.items || [];
  const totalResults = data?.count || 0;

  // Filter inventory based on search and category
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === t('inventory.allCategories') || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Reset to page 1 when search, category, or items per page changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, itemsPerPage]);

  // Calculate pagination based on filtered results
  const filteredTotalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t('inventory.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and track all products in your inventory
          </p>
        </div>
        <Link 
          href="/product"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#162660] hover:bg-[#162660]/90 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('inventory.addProduct')}
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {(error as any).response?.data?.message || 'Failed to load inventory. Please try again.'}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#162660]" />
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {inventory.length === 0 ? t('inventory.noProducts') : t('inventory.noMatch')}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('inventory.productName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('inventory.sku')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('inventory.category')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('inventory.quantity')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('inventory.price')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('inventory.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {paginatedInventory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs font-medium text-gray-500 mr-3">
                              {item.productName.charAt(0)}
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.productName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(convertFromBase(item.unitPrice, userCurrency))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 text-gray-400 hover:text-[#162660] dark:hover:text-[#D0E6FD] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
              <Pagination
                currentPage={currentPage}
                totalPages={filteredTotalPages}
                onPageChange={setCurrentPage}
                totalResults={filteredInventory.length}
                displayedResults={paginatedInventory.length}
                resultLabel={t('inventory.results')}
              />
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <EditInventoryModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        categories={categories}
        onSave={updateItem}
        isPending={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        itemName={deletingItem?.productName || ''}
        onConfirm={() => deletingItem ? deleteItem(deletingItem._id) : Promise.resolve()}
        isPending={isDeleting}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
        autoClose={2000}
      />
    </div>
  );
}
