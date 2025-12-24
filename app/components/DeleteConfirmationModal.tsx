'use client';

import React from 'react';
import { X, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header with theme colors */}
        <div className="bg-gradient-to-br from-[#162660] to-[#162660]/80 dark:from-slate-800 dark:to-slate-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center ">
            
            <h2 className="text-lg font-bold text-white">
              {t('inventory.deleteConfirmation')}
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Alert Section */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
             
            </div>
            <div className="flex-1">
              <p className="text-gray-800 dark:text-gray-200 font-semibold leading-relaxed">
                {t('inventory.deleteConfirmationMessage')}
              </p>
              <div className="mt-4 p-3.5 bg-gradient-to-r from-[#F1E4D1]/40 to-[#D0E6FD]/40 dark:from-[#162660]/20 dark:to-[#D0E6FD]/10 border border-[#162660]/20 dark:border-[#D0E6FD]/20 rounded-lg">
                <p className="text-sm font-bold text-[#162660] dark:text-[#D0E6FD] break-words">
                  "{itemName}"
                </p>
              </div>
            </div>
          </div>

          {/* Warning Box  */}
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 dark:border-red-400 rounded-r-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                {t('inventory.deleteWarning')}
              </p>
            </div>
          </div>
        </div>

        {/* Actions - Theme colored cancel button */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex gap-3 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 border-2 border-[#162660] dark:border-[#D0E6FD] text-[#162660] dark:text-[#D0E6FD] font-semibold rounded-lg hover:bg-[#162660]/5 dark:hover:bg-[#D0E6FD]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
