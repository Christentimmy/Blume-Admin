import { MoreHorizontal, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const recentUsers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", status: "active", joined: "2 hours ago", verified: true },
  { id: 2, name: "Michael Chen", email: "michael@email.com", status: "pending", joined: "5 hours ago", verified: false },
  { id: 3, name: "Emily Davis", email: "emily@email.com", status: "active", joined: "1 day ago", verified: true },
  { id: 4, name: "James Wilson", email: "james@email.com", status: "suspended", joined: "2 days ago", verified: true },
  { id: 5, name: "Amanda Brown", email: "amanda@email.com", status: "active", joined: "3 days ago", verified: false },
];

export function RecentUsers() {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Users</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {recentUsers.map((user, index) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between py-3 border-b border-border last:border-0 animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{user.name}</p>
                  {user.verified && (
                    <Check className="h-3.5 w-3.5 text-success" />
                  )}
                </div>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className={
                  user.status === "active" 
                    ? "border-success/30 text-success bg-success/10" 
                    : user.status === "pending"
                    ? "border-warning/30 text-warning bg-warning/10"
                    : "border-destructive/30 text-destructive bg-destructive/10"
                }
              >
                {user.status}
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:block">{user.joined}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit User</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
