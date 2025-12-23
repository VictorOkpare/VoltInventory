'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Invalid Link
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            This password reset link is invalid or has expired.
          </p>
          <Link 
            href="/forgot-password" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#162660] hover:bg-[#162660]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#162660]"
          >
            Request New Link
          </Link>
        </div>
      </div>
    </div>
  );
}