'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Package } from 'lucide-react';
import { useCurrency } from '@/app/hooks/useCurrency';
import { useTranslations } from '@/app/hooks/useTranslations';

interface InventoryItem {
  _id: string;
  productName: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  sku: string;
  imageUrl?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  categories: string[];
  onSave: (item: Omit<InventoryItem, 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isPending: boolean;
}

export default function EditInventoryModal({
  isOpen,
  onClose,
  item,
  categories,
  onSave,
  isPending,
}: EditInventoryModalProps) {
  const { t } = useTranslations();
  const { convertFromBase, convertToBase, userCurrency } = useCurrency();
  const [formData, setFormData] = useState<InventoryItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        unitPrice: convertFromBase(item.unitPrice, userCurrency),
      });
      setImagePreview(item.imageUrl || '');
    }
  }, [item, userCurrency, convertFromBase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        if (formData) {
          setFormData({ ...formData, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const updatedItem = {
      ...formData,
      unitPrice: convertToBase(formData.unitPrice, userCurrency),
    };

    await onSave(updatedItem);
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-800">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#162660] to-[#162660]/80 dark:from-slate-800 dark:to-slate-900 px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D0E6FD] dark:bg-[#162660]/30 rounded-lg">
              <Package className="w-5 h-5 text-[#162660] dark:text-[#D0E6FD]" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {t('inventory.editProduct')}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-50 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-[#162660] dark:text-[#D0E6FD] mb-2.5">
              {t('inventory.productName')}
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* SKU and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#162660] dark:text-[#D0E6FD] mb-2.5">
                {t('inventory.sku')}
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#162660] dark:text-[#D0E6FD] mb-2.5">
                {t('inventory.quantity')}
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#162660] dark:text-[#D0E6FD] mb-2.5">
                {t('inventory.category')}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#162660] dark:text-[#D0E6FD] mb-2.5">
                {t('inventory.price')}
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#162660] dark:text-[#D0E6FD] mb-2.5">
              {t('inventory.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#162660] focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#162660] dark:text-[#D0E6FD] mb-2.5">
              {t('inventory.image')}
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-[#162660]/30 dark:border-[#D0E6FD]/30 rounded-xl cursor-pointer hover:bg-[#D0E6FD]/5 dark:hover:bg-[#162660]/10 transition-all">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2.5 bg-[#D0E6FD]/20 dark:bg-[#162660]/20 rounded-lg">
                    <Upload className="w-5 h-5 text-[#162660] dark:text-[#D0E6FD]" />
                  </div>
                  <span className="text-sm font-medium text-[#162660] dark:text-[#D0E6FD]">
                    {t('inventory.uploadImage')}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isPending}
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-700 text-[#162660] dark:text-[#D0E6FD] font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 disabled:opacity-50 transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-3 bg-[#162660] hover:bg-[#162660]/90 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
