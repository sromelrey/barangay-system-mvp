'use client';

import { useParams, useRouter } from 'next/navigation';
import { useClearanceStore } from '@/store/clearance.store';
import { useResidentStore } from '@/store/resident.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';

export default function ClearanceViewPage() {
  const params = useParams();
  const router = useRouter();
  const clearances = useClearanceStore((state) => state.clearances);
  const residents = useResidentStore((state) => state.residents);

  // Barangay branding constants
  const barangayInfo = {
    province: 'Cavite',
    municipality: 'Dasmariñas',
    barangay: 'Barangay 1',
    captain: 'Juan Dela Cruz',
  };

  const clearance = clearances.find((c) => c.id === params.id);
  const resident = residents.find((r) => r.id === clearance?.residentId);

  if (!clearance || !resident) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Clearance not found</p>
          <Button onClick={() => router.push('/clearance')} className="mt-4">
            Back to Clearances
          </Button>
        </div>
      </div>
    );
  }

  const titleMap = {
    Clearance: 'Barangay Clearance',
    Residency: 'Certificate of Residency',
    Indigency: 'Certificate of Indigency',
  };

  const title = titleMap[clearance.type];

  const bodyText =
    clearance.type === 'Clearance'
      ? `This is to certify that ${resident.name}, a resident of this barangay, is known to be of good moral character and has no derogatory record on file.`
      : clearance.type === 'Indigency'
      ? `This is to certify that ${resident.name} is an indigent resident of this barangay.`
      : `This is to certify that ${resident.name} is a bona fide resident of this barangay.`;

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

  return (
    <div className="container mx-auto max-w-4xl p-6">
            {/* Header */}
      <div className="mb-6 flex items-center justify-between no-print">
        <Button variant="ghost" onClick={() => router.push('/clearance')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleGeneratePDF} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <Card className="rounded-2xl border-gray-300 shadow-sm bg-white print-certificate text-black">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-sm font-bold">Republic of the Philippines</p>
            <p className="text-xs text-gray-600">Province of {barangayInfo.province}</p>
            <p className="text-xs text-gray-600">Municipality of {barangayInfo.municipality}</p>
            <p className="text-sm font-bold mt-1">BARANGAY {barangayInfo.barangay}</p>
            <p className="text-xs text-gray-600">Office of the Barangay Captain</p>
          </div>

          <div className="border-b-2 border-gray-300 mb-6"></div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-6 uppercase">{title}</h1>

          <div className="border-b border-gray-300 mb-6"></div>

          {/* Body */}
          <p className="text-base leading-relaxed mb-6">{bodyText}</p>

          {/* Purpose */}
          <div className="mb-6">
            <p className="font-bold">Purpose:</p>
            <p>{clearance.purpose}</p>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-8">
            <div>
              <p className="font-bold">Name:</p>
              <p>{resident.name}</p>
            </div>
            <div>
              <p className="font-bold">Address:</p>
              <p>{resident.address}</p>
            </div>
            <div>
              <p className="font-bold">Date Issued:</p>
              <p>{new Date(clearance.dateIssued).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-bold">Control No:</p>
              <p className="font-bold text-lg">{clearance.controlNo}</p>
            </div>
          </div>

          {/* Photo */}
          {clearance.photo && (
            <div className="mb-8 flex justify-end">
              <img
                src={clearance.photo}
                alt="Resident photo"
                className="w-32 h-40 object-cover rounded border-2 border-gray-300"
              />
            </div>
          )}

          {/* Signature */}
          <div className="text-center mt-12">
            <div className="border-b-2 border-gray-400 w-48 mx-auto mb-2"></div>
            <p className="font-bold">{barangayInfo.captain}</p>
            <p className="text-sm text-gray-600">Barangay Captain</p>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-600">
              This document was generated through the Barangay System
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
