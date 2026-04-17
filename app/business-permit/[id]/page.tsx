'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useBusinessPermitStore } from '@/store/business-permit.store';
import { useResidentStore } from '@/store/resident.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BusinessPermitViewPage() {
  const params = useParams();
  const router = useRouter();
  const businessPermits = useBusinessPermitStore((state) => state.businessPermits);
  const residents = useResidentStore((state) => state.residents);

  // Barangay branding constants
  const barangayInfo = {
    province: '[Province]',
    municipality: '[Municipality]',
    barangay: '[Barangay Name]',
    captain: '[Barangay Captain Name]',
  };

  const permit = businessPermits.find((p) => p.id === params.id);
  const owner = residents.find((r) => r.id === permit?.ownerId);

  if (!permit || !owner) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Business Permit Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {'The business permit you\'re looking for doesn\'t exist.'}
          </p>
          <Button onClick={() => router.push('/business-permit')}>
            Back to Business Permits
          </Button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = async () => {
    try {
      // For now, use window.print() which already works
      // The PDF generation libraries have version conflicts
      alert('Please use the Print button to save as PDF. The direct PDF download feature is temporarily unavailable due to library conflicts.');
      window.print();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'default',
      expired: 'destructive',
      pending: 'secondary',
      cancelled: 'outline',
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between no-print">
        <Button variant="ghost" onClick={() => router.push('/business-permit')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Business Permits
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleGeneratePDF} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Business Permit Certificate */}
      <div className="print-certificate">
        <Card className="mb-6">
          <CardContent className="p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-lg font-bold mb-2">Republic of the Philippines</h2>
              <p className="text-sm text-gray-600">Province of {barangayInfo.province}</p>
              <p className="text-sm text-gray-600">Municipality of {barangayInfo.municipality}</p>
              <p className="text-lg font-bold mt-2">BARANGAY {barangayInfo.barangay}</p>
              <p className="text-sm text-gray-600">Office of the Barangay Captain</p>
            </div>

            {/* Title */}
            <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-8">
              <h1 className="text-2xl font-bold text-center uppercase">Business Permit</h1>
            </div>

            {/* Permit Number */}
            <div className="text-right mb-8">
              <p className="text-sm font-bold">Permit No.: {permit.permitNumber}</p>
            </div>

            {/* Business Details */}
            <div className="mb-8">
              <p className="mb-4">
                This is to certify that the business named <strong>{permit.businessName}</strong>,
                owned and operated by <strong>{owner.name}</strong>, is hereby granted a permit
                to operate a <strong>{permit.businessType}</strong> business at:
              </p>
              <p className="pl-8 border-l-4 border-gray-300 italic">
                {permit.businessAddress}
              </p>
            </div>

            {/* Validity */}
            <div className="mb-8">
              <p>
                This permit is valid from <strong>{new Date(permit.dateIssued).toLocaleDateString()}</strong>{' '}
                until <strong>{new Date(permit.dateExpired).toLocaleDateString()}</strong>.
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-8 text-center">
              {getStatusBadge(permit.status)}
            </div>

            {/* Conditions */}
            <div className="mb-8">
              <p className="text-sm italic">
                This permit is issued subject to compliance with all applicable laws,
                ordinances, and regulations governing the operation of the business.
              </p>
            </div>

            {/* Fees */}
            <div className="mb-8">
              <p className="font-bold">Permit Fee: ₱{permit.fee.toFixed(2)}</p>
              {permit.orNumber && (
                <p className="text-sm">Official Receipt No.: {permit.orNumber}</p>
              )}
            </div>

            {/* Signature */}
            <div className="text-center mt-12">
              <div className="border-t-2 border-gray-600 w-48 mx-auto mb-2"></div>
              <p className="font-bold">{barangayInfo.captain}</p>
              <p className="text-sm text-gray-600">Barangay Captain</p>
            </div>

            {/* Business Photo */}
            {permit.requirements.picture && (
              <div className="mt-8 text-center">
                <Image
                  src={permit.requirements.picture}
                  alt="Business"
                  width={192}
                  height={192}
                  className="object-cover mx-auto rounded border"
                />
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-8 text-xs text-gray-500">
              <p>This document was generated through the Barangay System</p>
              <p>Issued on {new Date(permit.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Card - Not Printable */}
        <Card className="no-print">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Requirements:</p>
                <ul className="mt-2 space-y-1">
                  {permit.requirements.dtiPermit && (
                    <li>• DTI Permit: {permit.requirements.dtiPermit}</li>
                  )}
                  {permit.requirements.barangayClearance && (
                    <li>• Barangay Clearance: {permit.requirements.barangayClearance}</li>
                  )}
                  {permit.requirements.fireSafety && (
                    <li>• Fire Safety: {permit.requirements.fireSafety}</li>
                  )}
                  {permit.requirements.sanitaryPermit && (
                    <li>• Sanitary Permit: {permit.requirements.sanitaryPermit}</li>
                  )}
                  {permit.requirements.cedula && (
                    <li>• Cedula: {permit.requirements.cedula}</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="font-medium">Owner Details:</p>
                <p className="mt-2">Name: {owner.name}</p>
                <p>Address: {owner.address}</p>
                <p>Contact: {owner.contact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
