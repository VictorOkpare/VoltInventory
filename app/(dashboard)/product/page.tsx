'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ImageUpload } from '@/app/components/ImageUpload';
import { useCurrency } from '@/app/hooks/useCurrency';
import { CurrencyInfo } from '@/app/components/CurrencyInfo';
import { useTranslations } from '@/app/hooks/useTranslations';

interface ProductFormData {
  productName: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  sku: string;
  imageUrl: string;
}

interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

export default function AddProductPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const { convertToBase, userCurrency, getCurrencySymbol } = useCurrency();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      productName: '',
      description: '',
      category: '',
      quantity: 0,
      unitPrice: 0,
      sku: '',
      imageUrl: '',
    },
  });

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

  const categories = categoriesData?.categories || [];
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert price from user currency to NGN (base currency)
      const priceInNGN = convertToBase(data.unitPrice, userCurrency);

      const response = await axios.post('/api/inventory', {
        productName: data.productName,
        description: data.description,
        category: data.category,
        quantity: data.quantity,
        unitPrice: priceInNGN, // Send price in NGN
        sku: data.sku,
        imageUrl: data.imageUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      router.push('/inventory');
    },
  });

  const handleImageChange = (imageUrl: string, preview: string) => {
    setValue('imageUrl', imageUrl);
  };

  const onSubmit = (data: ProductFormData) => {
    mutate(data);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('product.title')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Fill in the details below to add a new product to the inventory
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {(error as any).response?.data?.message || 'Failed to add product. Please try again.'}
        </div>
      )}

      <CurrencyInfo />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Upload */}
          <div className="lg:col-span-1">
            <ImageUpload onImageChange={handleImageChange} />
            {errors.imageUrl && (
              <p className="mt-2 text-xs text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('product.productName')}
                </label>
                <input
                  type="text"
                  id="productName"
                  {...register('productName', { 
                    required: 'Product name is required',
                    minLength: {
                      value: 3,
                      message: 'Product name must be at least 3 characters'
                    }
                  })}
                  placeholder="e.g. Premium Wireless Headphones"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.productName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-[#162660]'
                  } bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                />
                {errors.productName && (
                  <p className="mt-1 text-xs text-red-500">{errors.productName.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('product.description')}
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter a detailed description of the product..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Category and SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('product.category')}
                  </label>
                  <select
                    id="category"
                    {...register('category', { required: 'Category is required' })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.category 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-700 focus:ring-[#162660]'
                    } bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all`}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('product.sku')}
                  </label>
                  <input
                    type="text"
                    id="sku"
                    {...register('sku', { required: 'SKU is required' })}
                    placeholder="e.g. HP-001"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.sku 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-700 focus:ring-[#162660]'
                    } bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                  />
                  {errors.sku && (
                    <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>
                  )}
                </div>
              </div>

              {/* Quantity and Unit Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('product.quantity')}
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 0, message: 'Quantity must be at least 0' },
                      valueAsNumber: true
                    })}
                    placeholder="0"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.quantity 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-700 focus:ring-[#162660]'
                    } bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('product.unitPrice')} ({getCurrencySymbol()})
                  </label>
                  <input
                    type="number"
                    id="unitPrice"
                    {...register('unitPrice', { 
                      required: 'Unit price is required',
                      min: { value: 0, message: 'Price must be at least 0' },
                      valueAsNumber: true
                    })}
                    placeholder="0.00"
                    step="0.01"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.unitPrice 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-700 focus:ring-[#162660]'
                    } bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                  />
                  {errors.unitPrice && (
                    <p className="mt-1 text-xs text-red-500">{errors.unitPrice.message}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <Link
                  href="/dashboard/inventory"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('common.cancel')}
                </Link>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-3 bg-[#162660] hover:bg-[#162660]/90 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('product.submitting')}
                    </>
                  ) : (
                    t('product.submit')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
