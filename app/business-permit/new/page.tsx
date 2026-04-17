'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useBusinessPermitStore } from '@/store/business-permit.store';
import { useResidentStore } from '@/store/resident.store';
import { BusinessPermitFormData } from '@/types/business-permit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Camera, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import { Select } from '@/components/ui/select';

const businessTypes = [
  'Retail Store',
  'Restaurant/Food Service',
  'Service Provider',
  'Manufacturing',
  'Wholesale',
  'Construction',
  'Transportation',
  'Education',
  'Healthcare',
  'Others',
];

export default function NewBusinessPermitPage() {
  const router = useRouter();
  const addBusinessPermit = useBusinessPermitStore((state) => state.addBusinessPermit);
  const residents = useResidentStore((state) => state.residents);
  
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BusinessPermitFormData>();

  const handleStartCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera');
    }
  };

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setStream(null);
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setValue('requirements.picture', photoData);
        handleCloseCamera();
      }
    }
  };

  const onSubmit = (data: BusinessPermitFormData) => {
    // Set default dates
    const permitData = {
      ...data,
      dateIssued: new Date(),
      dateExpired: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    };
    
    addBusinessPermit(permitData);
    router.push('/business-permit');
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/business-permit">
            <Button variant="ghost" size="icon" className="gap-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Business Permit</h1>
            <p className="text-muted-foreground mt-1">Issue a new business permit</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  {...register('businessName', { required: 'Business name is required' })}
                  placeholder="Enter business name"
                />
                {errors.businessName && (
                  <p className="text-sm text-destructive mt-1">{errors.businessName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  id="businessType"
                  {...register('businessType', { required: 'Business type is required' })}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
                {errors.businessType && (
                  <p className="text-sm text-destructive mt-1">{errors.businessType.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                {...register('businessAddress', { required: 'Business address is required' })}
                placeholder="Enter complete business address"
                rows={3}
              />
              {errors.businessAddress && (
                <p className="text-sm text-destructive mt-1">{errors.businessAddress.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ownerId">Select Owner</Label>
              <Select
                id="ownerId"
                {...register('ownerId', { required: 'Owner is required' })}
              >
                <option value="">Select business owner</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.name}
                  </option>
                ))}
              </Select>
              {errors.ownerId && (
                <p className="text-sm text-destructive mt-1">{errors.ownerId.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtiPermit">DTI Permit Number</Label>
                <Input
                  id="dtiPermit"
                  {...register('requirements.dtiPermit')}
                  placeholder="Enter DTI permit number"
                />
              </div>
              <div>
                <Label htmlFor="barangayClearance">Barangay Clearance Number</Label>
                <Input
                  id="barangayClearance"
                  {...register('requirements.barangayClearance')}
                  placeholder="Enter clearance number"
                />
              </div>
              <div>
                <Label htmlFor="fireSafety">Fire Safety Certificate Number</Label>
                <Input
                  id="fireSafety"
                  {...register('requirements.fireSafety')}
                  placeholder="Enter certificate number"
                />
              </div>
              <div>
                <Label htmlFor="sanitaryPermit">Sanitary Permit Number</Label>
                <Input
                  id="sanitaryPermit"
                  {...register('requirements.sanitaryPermit')}
                  placeholder="Enter permit number"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cedula">Cedula Number</Label>
              <Input
                id="cedula"
                {...register('requirements.cedula')}
                placeholder="Enter cedula number"
              />
            </div>

            <div>
              <Label>Business Picture</Label>
              <div className="mt-2">
                {(() => {
                  const picture = watch('requirements.picture');
                  return picture ? (
                    <div className="relative inline-block">
                      <Image
                        src={picture}
                        alt="Business"
                        width={192}
                        height={192}
                        className="object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setValue('requirements.picture', '')}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleStartCamera}
                        className="gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Take Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload File
                      </Button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Permit Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fee">Permit Fee (₱)</Label>
                <Input
                  id="fee"
                  type="number"
                  {...register('fee', { required: 'Fee is required', valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.fee && (
                  <p className="text-sm text-destructive mt-1">{errors.fee.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="orNumber">OR Number</Label>
                <Input
                  id="orNumber"
                  {...register('orNumber')}
                  placeholder="Enter OR number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/business-permit">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="gap-2">
            <FileText className="h-4 w-4" />
            Issue Permit
          </Button>
        </div>
      </form>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Take Business Photo</h3>
            </div>
            <video
              ref={videoRef}
              autoPlay
              className="w-full rounded-lg mb-4"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseCamera}>
                Cancel
              </Button>
              <Button onClick={handleCapturePhoto}>
                Capture Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
