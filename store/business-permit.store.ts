import { create } from 'zustand';
import { BusinessPermit, BusinessPermitFormData } from '@/types/business-permit';
import { v4 as uuidv4 } from 'uuid';

interface BusinessPermitStore {
  businessPermits: BusinessPermit[];
  addBusinessPermit: (permit: BusinessPermitFormData) => void;
  updateBusinessPermit: (id: string, permit: Partial<BusinessPermit>) => void;
  deleteBusinessPermit: (id: string) => void;
  getBusinessPermit: (id: string) => BusinessPermit | undefined;
  generatePermitNumber: () => string;
  updateExpiredPermits: () => void;
}

export const useBusinessPermitStore = create<BusinessPermitStore>((set, get) => ({
  businessPermits: [],

  addBusinessPermit: (permitData) => {
    const newPermit: BusinessPermit = {
      ...permitData,
      id: uuidv4(),
      permitNumber: get().generatePermitNumber(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'approved', // Default to approved for MVP
    };
    
    set((state) => ({
      businessPermits: [...state.businessPermits, newPermit],
    }));
  },

  updateBusinessPermit: (id, updatedData) => {
    set((state) => ({
      businessPermits: state.businessPermits.map((permit) =>
        permit.id === id
          ? { ...permit, ...updatedData, updatedAt: new Date() }
          : permit
      ),
    }));
  },

  deleteBusinessPermit: (id) => {
    set((state) => ({
      businessPermits: state.businessPermits.filter((permit) => permit.id !== id),
    }));
  },

  getBusinessPermit: (id) => {
    return get().businessPermits.find((permit) => permit.id === id);
  },

  generatePermitNumber: () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BP-${year}-${random}`;
  },

  updateExpiredPermits: () => {
    const now = new Date();
    set((state) => ({
      businessPermits: state.businessPermits.map((permit) =>
        permit.status === 'approved' && new Date(permit.dateExpired) < now
          ? { ...permit, status: 'expired', updatedAt: new Date() }
          : permit
      ),
    }));
  },
}));
