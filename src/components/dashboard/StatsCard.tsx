import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  style?: CSSProperties;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({ title, value, change, changeType, icon: Icon, className }: StatsCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-xl p-6 animate-fade-in",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 tracking-tight">{value}</p>
          <p className={cn(
            "text-sm mt-2 font-medium",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}>
            {change}
          </p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
