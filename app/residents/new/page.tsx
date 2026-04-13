'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResidentStore } from '@/store/resident.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewResidentPage() {
  const router = useRouter();
  const addResident = useResidentStore((state) => state.addResident);
  
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    address: '',
    contact: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResident(formData);
    router.push('/residents');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto max-w-lg p-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/residents')}
          className="mb-2 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Resident</h1>
        <p className="text-muted-foreground mt-1">Register a new barangay resident</p>
      </div>

      {/* Form Card */}
      <Card className="rounded-2xl border-muted shadow-sm">
        <CardHeader>
          <CardTitle>Resident Information</CardTitle>
          <CardDescription>Fill in the details below to register a resident</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">
                Save Resident
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/residents')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
