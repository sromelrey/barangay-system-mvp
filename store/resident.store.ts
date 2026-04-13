import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resident } from '@/types/resident';

interface ResidentStore {
  residents: Resident[];
  addResident: (resident: Omit<Resident, 'id'>) => void;
}

export const useResidentStore = create<ResidentStore>()(
  persist(
    (set) => ({
      residents: [],
      addResident: (resident) => {
        const newResident: Resident = {
          ...resident,
          id: crypto.randomUUID(),
        };
        set((state) => ({ residents: [...state.residents, newResident] }));
      },
    }),
    {
      name: 'resident-storage',
    }
  )
);
