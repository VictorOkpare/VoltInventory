'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'Weak' | 'Medium' | 'Strong'>('Weak');

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.post('/api/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  // Check if error is about company already having admin
  const isCompanyHasAdmin = (error as any)?.response?.data?.message?.includes('already exists') || 
                           (error as any)?.response?.data?.message?.includes('Company');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength('Weak');
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 1) setPasswordStrength('Weak');
    else if (strength === 2 || strength === 3) setPasswordStrength('Medium');
    else setPasswordStrength('Strong');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'Weak': return 'w-1/3';
      case 'Medium': return 'w-2/3';
      case 'Strong': return 'w-full';
      default: return 'w-0';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Get started with your inventory management.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">
              {(error as any).response?.data?.message || 'Something went wrong. Please try again.'}
            </p>
            {isCompanyHasAdmin && (
              <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                  This company already has a registered account.
                </p>
                <Link 
                  href="/login" 
                  className="inline-block text-sm font-semibold text-[#162660] dark:text-[#D0E6FD] hover:underline"
                >
                  Click here to login →
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="e.g., Jane"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="e.g., Doe"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="e.g., Acme Corporation"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., name@company.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a secure password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
            </div>
          </div>

          {/* Password Strength */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Password Strength:</span>
                <span className={`font-medium ${
                  passwordStrength === 'Weak' ? 'text-red-500' :
                  passwordStrength === 'Medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {passwordStrength}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-[#162660] hover:bg-[#162660]/90 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#162660] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-semibold text-[#162660] dark:text-[#D0E6FD] hover:underline"
            >
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
