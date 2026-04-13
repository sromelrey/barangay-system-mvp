'use client';

import Link from 'next/link';
import { useClearanceStore } from '@/store/clearance.store';
import { useResidentStore } from '@/store/resident.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ArrowLeft, Eye } from 'lucide-react';

export default function ClearancePage() {
  const clearances = useClearanceStore((state) => state.clearances);
  const residents = useResidentStore((state) => state.residents);

  const getResidentName = (residentId: string) => {
    const resident = residents.find((r) => r.id === residentId);
    return resident?.name || 'Unknown Resident';
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="gap-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clearance & Certifications</h1>
            <p className="text-muted-foreground mt-1">Manage barangay clearances and certificates</p>
          </div>
        </div>
        <Link href="/clearance/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Clearance
          </Button>
        </Link>
      </div>

      {/* Clearances Card */}
      <Card className="rounded-2xl border-muted shadow-sm">
        <CardHeader>
          <CardTitle>All Clearances</CardTitle>
          <CardDescription>View and manage all issued clearances</CardDescription>
        </CardHeader>
        <CardContent>
          {clearances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                No clearances yet. Create your first one.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2">Type</TableHead>
                  <TableHead className="px-4 py-2">Resident Name</TableHead>
                  <TableHead className="px-4 py-2">Purpose</TableHead>
                  <TableHead className="px-4 py-2">Date Issued</TableHead>
                  <TableHead className="px-4 py-2">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clearances.map((clearance) => (
                  <TableRow key={clearance.id} className="hover:bg-muted">
                    <TableCell className="px-4 py-3 font-medium">{clearance.type}</TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {getResidentName(clearance.residentId)}
                    </TableCell>
                    <TableCell className="px-4 py-3">{clearance.purpose}</TableCell>
                    <TableCell className="px-4 py-3">
                      {new Date(clearance.dateIssued).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Link href={`/clearance/${clearance.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
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
