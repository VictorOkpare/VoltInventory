import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      itemsPerPage: 16,
      setItemsPerPage: (items: number) => set({ itemsPerPage: items }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);
