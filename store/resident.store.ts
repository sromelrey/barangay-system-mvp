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
      residents: [
        {
          id: '1',
          name: 'Juan Dela Cruz',
          address: '123 Main St, Barangay 1',
          birthdate: '1989-05-15',
          contact: '09123456789',
        },
        {
          id: '2',
          name: 'Maria Santos',
          address: '456 Rizal Ave, Barangay 1',
          birthdate: '1996-08-22',
          contact: '09987654321',
        },
        {
          id: '3',
          name: 'Pedro Reyes',
          address: '789 Mabini St, Barangay 1',
          birthdate: '1982-03-10',
          contact: '09112223333',
        },
      ],
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
