'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { useTranslations } from '@/app/hooks/useTranslations';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSave: (categories: string[]) => void;
  isPending?: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  categories,
  onSave,
  isPending = false,
}: CategoryModalProps) {
  const { t } = useTranslations();
  const [editingCategories, setEditingCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  // Update local state when categories prop changes
  useEffect(() => {
    if (isOpen) {
      setEditingCategories([...categories]);
      setNewCategory('');
    }
  }, [isOpen, categories]);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setEditingCategories([...editingCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (index: number) => {
    setEditingCategories(editingCategories.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(editingCategories);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#162660] dark:text-white">
              {t('components.categoryModal.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Add New Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#162660] dark:text-gray-300 mb-2">
              {t('components.categoryModal.addNew')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                placeholder={t('components.categoryModal.enterName')}
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
              {t('components.categoryModal.current')} ({editingCategories.length})
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

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2.5 bg-[#162660] hover:bg-[#162660]/90 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('components.categoryModal.saving')}
              </>
            ) : (
              t('common.save')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
