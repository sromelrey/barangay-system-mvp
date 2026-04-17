import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, HeartHandshake, Scale, Building, ArrowRight } from 'lucide-react';

export default function Home() {
  const modules = [
    {
      title: 'Residents',
      description: 'Manage barangay resident records',
      icon: Users,
      route: '/residents',
      color: 'text-blue-600',
    },
    {
      title: 'Clearance',
      description: 'Issue barangay certificates',
      icon: FileText,
      route: '/clearance',
      color: 'text-green-600',
    },
    {
      title: 'Business Permit',
      description: 'Issue business operation permits',
      icon: Building,
      route: '/business-permit',
      color: 'text-amber-600',
    },
    {
      title: 'GAD Services',
      description: 'Track beneficiaries and assistance',
      icon: HeartHandshake,
      route: '/gad',
      color: 'text-purple-600',
    },
    {
      title: 'Lupon',
      description: 'Manage barangay dispute cases',
      icon: Scale,
      route: '/lupon',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Header Section */}
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Barangay System</h1>
        <p className="text-muted-foreground text-lg">
          Manage residents, services, and barangay operations
        </p>
      </div>

      {/* Summary Stats (Optional) */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-muted shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Residents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-muted shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clearances Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-muted shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Module Portal Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.route} href={module.route}>
              <Card className="h-full rounded-2xl border-muted shadow-sm transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${module.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full gap-2 group">
                    Open
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
