export interface BusinessPermit {
  id: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  ownerId: string;
  permitNumber: string;
  dateIssued: Date;
  dateExpired: Date;
  status: 'pending' | 'approved' | 'expired' | 'cancelled';
  fee: number;
  orNumber?: string; // Official Receipt Number
  requirements: {
    dtiPermit?: string;
    barangayClearance?: string;
    fireSafety?: string;
    sanitaryPermit?: string;
    cedula?: string;
    picture?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type BusinessPermitFormData = Omit<BusinessPermit, 'id' | 'createdAt' | 'updatedAt'>;
