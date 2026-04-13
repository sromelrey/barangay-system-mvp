'use client';

import Link from 'next/link';
import { useResidentStore } from '@/store/resident.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

export default function ResidentsPage() {
  const residents = useResidentStore((state) => state.residents);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Residents</h1>
          <p className="text-muted-foreground mt-1">Manage barangay residents</p>
        </div>
        <Link href="/residents/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Resident
          </Button>
        </Link>
      </div>

      {/* Residents Card */}
      <Card className="rounded-2xl border-muted shadow-sm">
        <CardHeader>
          <CardTitle>All Residents</CardTitle>
          <CardDescription>View and manage all registered residents</CardDescription>
        </CardHeader>
        <CardContent>
          {residents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                No residents yet. Start by adding one.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2">Name</TableHead>
                  <TableHead className="px-4 py-2">Address</TableHead>
                  <TableHead className="px-4 py-2">Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residents.map((resident) => (
                  <TableRow key={resident.id} className="hover:bg-muted cursor-pointer">
                    <TableCell className="px-4 py-3 font-medium">{resident.name}</TableCell>
                    <TableCell className="px-4 py-3">{resident.address}</TableCell>
                    <TableCell className="px-4 py-3">{resident.contact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
