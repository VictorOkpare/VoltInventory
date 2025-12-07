'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PackageX, Home, ArrowLeft, Search } from 'lucide-react';
import { useTranslations } from './hooks/useTranslations';

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <PackageX 
              className="w-32 h-32 text-blue-600 dark:text-blue-400 relative animate-bounce" 
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for seems to have wandered off. 
          It might be out of stock or moved to a different location.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <Link
            href="/home"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Home className="w-5 h-5" />
            Home Dashboard
          </Link>

          <Link
            href="/inventory"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Search className="w-5 h-5" />
            Browse Inventory
          </Link>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Check out our{' '}
            <Link href="/home" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              documentation
            </Link>{' '}
            or contact support.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
