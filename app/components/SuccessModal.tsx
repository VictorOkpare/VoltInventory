'use client';

import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  autoClose?: number; // milliseconds
}

export default function SuccessModal({
  isOpen,
  onClose,
  message,
  autoClose = 2000,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg max-w-sm w-full border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Success Indicator */}
        <div className="h-1 bg-green-500" />

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Success!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-green-100 dark:bg-green-900/20 overflow-hidden">
          <div
            className="h-full bg-green-500 animate-pulse"
            style={{
              animation: `shrink ${autoClose}ms linear`,
            }}
          />
        </div>

        <style jsx>{`
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
