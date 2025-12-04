'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);

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

  const categories = ['All Categories', ...(categoriesData?.categories || [])];

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

  const inventory = data?.items || [];
  const totalResults = data?.count || 0;
  const resultsPerPage = 16;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Filter inventory based on search and category
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and track all products in your inventory
          </p>
        </div>
        <Link 
          href="/dashboard/product"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#162660] hover:bg-[#162660]/90 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
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
              placeholder="Search by product name, SKU, or category"
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
              {inventory.length === 0 ? 'No products in inventory yet.' : 'No products match your search.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredInventory.map((item) => (
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
                        NGN{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="p-1.5 text-gray-400 hover:text-[#162660] dark:hover:text-[#D0E6FD] transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
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
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredInventory.length} of {totalResults} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-[#162660] text-white'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
