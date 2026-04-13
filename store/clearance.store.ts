import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Clearance } from '@/types/clearance';

interface ClearanceStore {
  clearances: Clearance[];
  addClearance: (clearance: Omit<Clearance, 'id' | 'controlNo'>) => void;
}

export const useClearanceStore = create<ClearanceStore>()(
  persist(
    (set) => ({
      clearances: [],
      addClearance: (clearance) => {
        const controlNo = `BRGY-${new Date().getFullYear()}-${Date.now()}`;
        const newClearance: Clearance = {
          ...clearance,
          id: crypto.randomUUID(),
          controlNo,
        };
        set((state) => ({ clearances: [...state.clearances, newClearance] }));
      },
    }),
    {
      name: 'clearance-storage',
    }
  )
);
