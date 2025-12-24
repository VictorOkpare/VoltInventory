'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  autoGenerateSKU: boolean;
  setAutoGenerateSKU: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      itemsPerPage: 16,
      setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
      autoGenerateSKU: true,
      setAutoGenerateSKU: (value: boolean) => set({ autoGenerateSKU: value }),
    }),
    {
      name: 'settings-storage',
      skipHydration: true,
      partialize: (state) => ({
        itemsPerPage: state.itemsPerPage,
        autoGenerateSKU: state.autoGenerateSKU,
      }),
    }
  )
);
