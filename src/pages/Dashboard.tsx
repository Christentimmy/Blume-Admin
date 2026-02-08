import { Users, Heart, Flag, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentUsers } from "@/components/dashboard/RecentUsers";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { ActivityChart } from "@/components/dashboard/ActivityChart";

const stats = [
  { 
    title: "Total Users", 
    value: "24,521", 
    change: "+12.5% from last month", 
    changeType: "positive" as const, 
    icon: Users 
  },
  { 
    title: "Active Matches", 
    value: "8,234", 
    change: "+8.2% from last month", 
    changeType: "positive" as const, 
    icon: Heart 
  },
  { 
    title: "Open Reports", 
    value: "127", 
    change: "-5.1% from last month", 
    changeType: "positive" as const, 
    icon: Flag 
  },
  { 
    title: "Revenue", 
    value: "$45.2K", 
    change: "+18.7% from last month", 
    changeType: "positive" as const, 
    icon: DollarSign 
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your app.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard 
            key={stat.title} 
            {...stat} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <RecentReports />
        </div>
      </div>

      <div>
        <RecentUsers />
      </div>
    </div>
  );
}
