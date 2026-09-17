import { Users, FileText, LayoutTemplate, Download, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_STATS, MOCK_ACTIVITY } from "@/data/mock-admin";
import { formatDate } from "@/lib/utils";

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-muted-foreground mb-2" />
        <p className="text-xl font-bold">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A demonstration of what an administrator could see — all figures below are static demo data.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Users" value={MOCK_STATS.userCount} />
        <StatCard icon={FileText} label="Resumes" value={MOCK_STATS.resumeCount} />
        <StatCard icon={LayoutTemplate} label="Templates" value={MOCK_STATS.templateCount} />
        <StatCard icon={Download} label="Downloads" value={MOCK_STATS.downloadCount} />
        <StatCard icon={Users} label="Active (30d)" value={MOCK_STATS.activeUsers30d} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0">
                <p className="text-sm">{item.message}</p>
                <span className="text-xs text-muted-foreground shrink-0">{formatDate(item.timestamp)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
