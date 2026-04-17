'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useClearanceStore } from '@/store/clearance.store';
import { useResidentStore } from '@/store/resident.store';
import { ClearanceType } from '@/types/clearance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Camera, FileText } from 'lucide-react';

export default function NewClearancePage() {
  const router = useRouter();
  const addClearance = useClearanceStore((state) => state.addClearance);
  const residents = useResidentStore((state) => state.residents);

  // Barangay branding constants
  const barangayInfo = {
    province: '[Province]',
    municipality: '[Municipality]',
    barangay: '[Barangay Name]',
    captain: '[Barangay Captain Name]',
  };
  
  const [formData, setFormData] = useState({
    residentId: '',
    type: 'Clearance' as ClearanceType,
    purpose: '',
    purposePreset: '',
    customPurpose: '',
    dateIssued: new Date().toISOString().split('T')[0],
    photo: '' as string,
  });

  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleOpenCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraOpen(false);
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setFormData({ ...formData, photo: photoData });
        handleCloseCamera();
      }
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClearance(formData);
    router.push('/clearance');
  };

  const handleSaveAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    addClearance(formData);
    await handleGeneratePDF();
    router.push('/clearance');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Update purpose based on preset
      purpose: name === 'purposePreset' 
        ? (value === 'Others' ? prev.customPurpose : value)
        : (name === 'customPurpose' && prev.purposePreset === 'Others' ? value : prev.purpose),
    }));
  };

  const resident = residents.find(r => r.id === formData.residentId);

  const titleMap = {
    Clearance: 'Barangay Clearance',
    Residency: 'Certificate of Residency',
    Indigency: 'Certificate of Indigency',
  };

  const bodyText = formData.type === 'Clearance'
    ? `This is to certify that ${resident?.name || '[Resident Name]'}, a resident of this barangay, is known to be of good moral character and has no derogatory record on file.`
    : formData.type === 'Indigency'
    ? `This is to certify that ${resident?.name || '[Resident Name]'} is an indigent resident of this barangay.`
    : `This is to certify that ${resident?.name || '[Resident Name]'} is a bona fide resident of this barangay.`;

  const controlNo = 'BRGY-2025-PREVIEW';

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/clearance')}
          className="mb-2 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Clearance</h1>
        <p className="text-gray-600 mt-1">Issue a barangay clearance</p>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card className="rounded-2xl border-gray-300 shadow-sm">
          <CardHeader>
            <CardTitle>Clearance Details</CardTitle>
            <CardDescription>Fill in the details below to issue a clearance</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Document Type</Label>
                <Select
                  id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Clearance">Barangay Clearance</option>
                <option value="Residency">Certificate of Residency</option>
                <option value="Indigency">Certificate of Indigency</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="residentId">Resident</Label>
              <Select
                id="residentId"
                name="residentId"
                value={formData.residentId}
                onChange={handleChange}
                required
              >
                <option value="">Select a resident</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.name}
                  </option>
                ))}
              </Select>
              {resident && (
                <Card className="bg-gray-100 border-gray-300">
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm">{resident.name}</p>
                    <p className="text-xs text-gray-600">{resident.address}</p>
                    <p className="text-xs text-gray-600">{resident.contact}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purposePreset">Purpose</Label>
              <Select
                id="purposePreset"
                name="purposePreset"
                value={formData.purposePreset}
                onChange={handleChange}
                required
              >
                <option value="">Select a purpose</option>
                <option value="Employment">Employment</option>
                <option value="Business Permit">Business Permit</option>
                <option value="School Requirement">School Requirement</option>
                <option value="Loan">Loan</option>
                <option value="Others">Others (specify below)</option>
              </Select>
              {formData.purposePreset === 'Others' && (
                <div className="space-y-2">
                  <Label htmlFor="customPurpose">Custom Purpose</Label>
                  <Textarea
                    id="customPurpose"
                    name="customPurpose"
                    value={formData.customPurpose}
                    onChange={handleChange}
                    placeholder="Enter the custom purpose"
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateIssued">Date Issued</Label>
              <Input
                id="dateIssued"
                name="dateIssued"
                type="date"
                value={formData.dateIssued}
                onChange={handleChange}
                required
              />
            </div>

            {/* Photo Section */}
            <div className="space-y-2">
              <Label>Photo (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenCamera}
                className="w-full gap-2"
              >
                <Camera className="h-4 w-4" />
                Capture Photo
              </Button>
              {formData.photo && (
                <div className="mt-2">
                  <img
                    src={formData.photo}
                    alt="Captured photo"
                    className="w-32 h-40 object-cover rounded-lg border-2 border-gray-300 p-1 bg-white"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">
                Save Clearance
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAndGenerate}
                className="flex-1 gap-2"
              >
                <FileText className="h-4 w-4" />
                Save & Generate PDF
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/clearance')}
              className="w-full"
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="rounded-2xl border-gray-300 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Certificate Preview</CardTitle>
          <CardDescription>Live preview of the clearance certificate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white border rounded-lg p-6 text-sm relative">
            {/* Control Number - Top Right */}
            <div className="absolute top-4 right-4 border-2 border-gray-400 rounded px-3 py-2 bg-gray-50">
              <p className="text-[10px] font-bold text-gray-600">CONTROL NO:</p>
              <p className="text-xs font-bold">{controlNo}</p>
            </div>

            {/* Header */}
            <div className="text-center mb-4 pr-24">
              <p className="text-xs font-bold">Republic of the Philippines</p>
              <p className="text-[10px] text-gray-600">Province of {barangayInfo.province}</p>
              <p className="text-[10px] text-gray-600">Municipality of {barangayInfo.municipality}</p>
              <p className="text-xs font-bold mt-1">BARANGAY {barangayInfo.barangay}</p>
              <p className="text-[10px] text-gray-600">Office of the Barangay Captain</p>
            </div>

            <div className="border-b border-gray-300 mb-4"></div>

            {/* Title */}
            <h2 className="text-lg font-bold text-center mb-4 uppercase">{titleMap[formData.type]}</h2>

            <div className="border-b border-gray-300 mb-4"></div>

            {/* Body */}
            <p className="text-xs leading-relaxed mb-4">{bodyText}</p>

            {/* Purpose */}
            <div className="mb-4">
              <p className="font-bold text-xs">Purpose:</p>
              <p className="text-xs">{formData.purpose || '[Purpose]'}</p>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div>
                <p className="font-bold text-xs">Name:</p>
                <p className="text-xs">{resident?.name || '[Resident Name]'}</p>
              </div>
              <div>
                <p className="font-bold text-xs">Date Issued:</p>
                <p className="text-xs">{new Date(formData.dateIssued).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Photo */}
            {formData.photo && (
              <div className="mb-4 flex justify-end">
                <img
                  src={formData.photo}
                  alt="Resident photo"
                  className="w-20 h-24 object-cover rounded border border-gray-300"
                />
              </div>
            )}

            {/* Signature */}
            <div className="text-center mt-8">
              <div className="border-b border-gray-400 w-32 mx-auto mb-1"></div>
              <p className="font-bold text-xs">{barangayInfo.captain}</p>
              <p className="text-[10px] text-gray-600">Barangay Captain</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

      {/* Camera Dialog */}
      <Dialog open={cameraOpen} onClose={handleCloseCamera}>
        <DialogHeader>
          <DialogTitle>Capture Photo</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg bg-black"
          />
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseCamera}>
            Cancel
          </Button>
          <Button onClick={handleCapturePhoto}>
            Capture
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
