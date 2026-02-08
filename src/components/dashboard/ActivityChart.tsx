import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", users: 240, matches: 180 },
  { name: "Tue", users: 300, matches: 220 },
  { name: "Wed", users: 280, matches: 250 },
  { name: "Thu", users: 420, matches: 310 },
  { name: "Fri", users: 580, matches: 450 },
  { name: "Sat", users: 620, matches: 520 },
  { name: "Sun", users: 540, matches: 480 },
];

export function ActivityChart() {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Weekly Activity</h3>
          <p className="text-muted-foreground text-sm mt-1">User signups & matches overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary/40" />
            <span className="text-sm text-muted-foreground">Matches</span>
          </div>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(2, 98%, 64%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(2, 98%, 64%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(2, 98%, 64%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(2, 98%, 64%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(0, 0%, 65%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(0, 0%, 65%)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 6%)', 
                border: '1px solid hsl(0, 0%, 14%)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}
              labelStyle={{ color: 'hsl(0, 0%, 98%)' }}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="hsl(2, 98%, 64%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorUsers)" 
            />
            <Area 
              type="monotone" 
              dataKey="matches" 
              stroke="hsl(2, 98%, 64%)" 
              strokeWidth={2}
              strokeOpacity={0.5}
              fillOpacity={1} 
              fill="url(#colorMatches)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
