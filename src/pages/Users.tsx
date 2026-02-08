import { useState } from "react";
import { Search, Filter, MoreHorizontal, Check, Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", status: "active", plan: "Premium", joined: "Jan 15, 2024", matches: 24, verified: true },
  { id: 2, name: "Michael Chen", email: "michael@email.com", status: "active", plan: "Free", joined: "Jan 18, 2024", matches: 12, verified: true },
  { id: 3, name: "Emily Davis", email: "emily@email.com", status: "pending", plan: "Premium", joined: "Jan 20, 2024", matches: 0, verified: false },
  { id: 4, name: "James Wilson", email: "james@email.com", status: "suspended", plan: "Free", joined: "Jan 22, 2024", matches: 8, verified: true },
  { id: 5, name: "Amanda Brown", email: "amanda@email.com", status: "active", plan: "Premium", joined: "Jan 25, 2024", matches: 31, verified: true },
  { id: 6, name: "David Lee", email: "david@email.com", status: "active", plan: "Free", joined: "Jan 28, 2024", matches: 5, verified: false },
  { id: 7, name: "Jessica Taylor", email: "jessica@email.com", status: "active", plan: "Premium", joined: "Feb 1, 2024", matches: 18, verified: true },
  { id: 8, name: "Robert Martinez", email: "robert@email.com", status: "pending", plan: "Free", joined: "Feb 3, 2024", matches: 0, verified: false },
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all registered users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
          <Button variant="outline" size="default">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Plan</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Joined</TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">Matches</TableHead>
                <TableHead className="text-muted-foreground w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow 
                  key={user.id} 
                  className="border-border animate-slide-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.verified && <Check className="h-3.5 w-3.5 text-success" />}
                        </div>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.plan === "Premium" ? "default" : "secondary"}>
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {user.joined}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {user.matches}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>View Matches</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
