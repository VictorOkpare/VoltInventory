'use client';

import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslations } from '@/app/hooks/useTranslations';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  isPending: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isPending,
}: DeleteConfirmationModalProps) {
  const { t } = useTranslations();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg max-w-sm w-full border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('inventory.deleteConfirmation')}
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                {t('inventory.deleteConfirmationMessage')}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
                "{itemName}"
              </p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-xs text-red-600 dark:text-red-400">
              {t('inventory.deleteWarning')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
