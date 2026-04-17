'use client';

import Link from 'next/link';
import { useBusinessPermitStore } from '@/store/business-permit.store';
import { useResidentStore } from '@/store/resident.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ArrowLeft, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BusinessPermitPage() {
  const businessPermits = useBusinessPermitStore((state) => state.businessPermits);
  const residents = useResidentStore((state) => state.residents);

  const getOwnerName = (ownerId: string) => {
    const resident = residents.find((r) => r.id === ownerId);
    return resident?.name || 'Unknown Owner';
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
            <h1 className="text-3xl font-bold tracking-tight">Business Permits</h1>
            <p className="text-muted-foreground mt-1">Manage barangay business permits</p>
          </div>
        </div>
        <Link href="/business-permit/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Permit
          </Button>
        </Link>
      </div>

      {/* Business Permits Card */}
      <Card className="rounded-2xl border-muted shadow-sm">
        <CardHeader>
          <CardTitle>All Business Permits</CardTitle>
          <CardDescription>View and manage all issued business permits</CardDescription>
        </CardHeader>
        <CardContent>
          {businessPermits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                No business permits have been issued yet.
              </p>
              <Link href="/business-permit/new" className="mt-4">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Issue First Permit
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Permit Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessPermits.map((permit) => (
                  <TableRow key={permit.id} className="hover:bg-muted">
                    <TableCell className="px-4 py-3 font-medium">
                      {permit.businessName}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {getOwnerName(permit.ownerId)}
                    </TableCell>
                    <TableCell className="px-4 py-3">{permit.businessType}</TableCell>
                    <TableCell className="px-4 py-3 font-mono text-sm">
                      {permit.permitNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getStatusBadge(permit.status)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {new Date(permit.dateExpired).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Link href={`/business-permit/${permit.id}`}>
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
