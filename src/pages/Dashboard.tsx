import { useState, useEffect } from "react";
import { Users, Heart, Flag, MessageSquare } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentUsers } from "@/components/dashboard/RecentUsers";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { dashboardService, DashboardStats } from "@/services/dashboard";
import { toast } from "sonner";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await dashboardService.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statsData = stats ? [
    { 
      title: "Total Users", 
      value: stats.users.toString(), 
      change: "Active users", 
      changeType: "positive" as const, 
      icon: Users 
    },
    { 
      title: "Total Matches", 
      value: stats.matches.toString(), 
      change: "Active matches", 
      changeType: "positive" as const, 
      icon: Heart 
    },
    { 
      title: "Support Tickets", 
      value: stats.supportTicket.toString(), 
      change: "Open tickets", 
      changeType: "positive" as const, 
      icon: MessageSquare 
    },
    { 
      title: "Pending Verifications", 
      value: stats.verification.toString(), 
      change: "Awaiting review", 
      changeType: "positive" as const, 
      icon: Flag 
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your app.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))
        ) : (
          statsData.map((stat, index) => (
            <StatsCard 
              key={stat.title} 
              {...stat} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))
        )}
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
