export type ClearanceType = 'Clearance' | 'Residency' | 'Indigency';

export interface Clearance {
  id: string;
  controlNo: string;
  residentId: string;
  type: ClearanceType;
  purpose: string;
  dateIssued: string;
  photo?: string;
}
