import { AlertTriangle, MessageSquare, Image, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reports = [
  { id: 1, type: "harassment", reporter: "Emily D.", reported: "User #4521", time: "10 min ago", priority: "high" },
  { id: 2, type: "fake_profile", reporter: "James W.", reported: "User #8832", time: "25 min ago", priority: "medium" },
  { id: 3, type: "inappropriate_content", reporter: "Sarah J.", reported: "User #1204", time: "1 hour ago", priority: "high" },
  { id: 4, type: "spam", reporter: "Michael C.", reported: "User #9921", time: "2 hours ago", priority: "low" },
];

const typeIcons = {
  harassment: MessageSquare,
  fake_profile: User,
  inappropriate_content: Image,
  spam: AlertTriangle,
};

const typeLabels = {
  harassment: "Harassment",
  fake_profile: "Fake Profile",
  inappropriate_content: "Inappropriate",
  spam: "Spam",
};

export function RecentReports() {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Reports</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {reports.map((report, index) => {
          const Icon = typeIcons[report.type as keyof typeof typeIcons];
          return (
            <div 
              key={report.id} 
              className="flex items-center justify-between py-3 border-b border-border last:border-0 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  report.priority === "high" 
                    ? "bg-destructive/10" 
                    : report.priority === "medium"
                    ? "bg-warning/10"
                    : "bg-muted"
                }`}>
                  <Icon className={`h-5 w-5 ${
                    report.priority === "high" 
                      ? "text-destructive" 
                      : report.priority === "medium"
                      ? "text-warning"
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{typeLabels[report.type as keyof typeof typeLabels]}</p>
                  <p className="text-muted-foreground text-xs">{report.reported} • by {report.reporter}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline"
                  className={
                    report.priority === "high"
                      ? "border-destructive/30 text-destructive bg-destructive/10"
                      : report.priority === "medium"
                      ? "border-warning/30 text-warning bg-warning/10"
                      : "border-muted-foreground/30 text-muted-foreground bg-muted"
                  }
                >
                  {report.priority}
                </Badge>
                <span className="text-xs text-muted-foreground hidden sm:block">{report.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
