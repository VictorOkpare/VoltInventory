'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useTranslations } from '@/app/hooks/useTranslations';

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'icon';
}

export default function LogoutButton({ className = '', variant = 'default' }: LogoutButtonProps) {
  const { t } = useTranslations();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Call logout endpoint
        await axios.post('/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem('token');
      setIsLoggingOut(false);
      router.push('/authentication/login');
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={t('components.logout.button')}
      >
        {isLoggingOut ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <LogOut className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t('components.logout.loggingOut')}</span>
        </>
      ) : (
        <>
          <LogOut className="w-5 h-5" />
          <span>{t('components.logout.button')}</span>
        </>
      )}
    </button>
  );
}
