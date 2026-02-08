import { useState, useEffect } from "react";
import { User, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardService, RecentUser } from "@/services/dashboard";
import { toast } from "sonner";

export function RecentUsers() {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await dashboardService.getRecentUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch recent users:', error);
        toast.error('Failed to load recent users');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Users</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            </div>
          ))
        ) : (
          users.map((user, index) => (
            <div 
              key={user.id} 
              className="flex items-center justify-between py-3 border-b border-border last:border-0 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">
                      {user.full_name || 'No name provided'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs truncate">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-xs flex-shrink-0">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
