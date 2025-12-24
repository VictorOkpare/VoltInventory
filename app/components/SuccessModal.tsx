'use client';

import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Success Header Bar */}
        <div className="h-1.5 bg-gradient-to-r from-green-400 to-green-500" />

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center space-y-5">
          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full blur-md" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Success!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-500"
              style={{
                animation: `shrink ${autoClose}ms linear`,
              }}
            />
          </div>
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
