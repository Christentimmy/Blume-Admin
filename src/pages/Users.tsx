import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Check, User, Mail } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usersService, IUser, UserStatus } from "@/services/users";
import { toast } from "sonner";

export default function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const userStatuses: UserStatus[] = ["active", "inactive", "banned", "blocked", "deleted"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersService.getAllUsers();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-success/30 text-success bg-success/10';
      case 'inactive':
        return 'border-muted-foreground/30 text-muted-foreground bg-muted';
      case 'banned':
      case 'blocked':
        return 'border-destructive/30 text-destructive bg-destructive/10';
      default:
        return 'border-warning/30 text-warning bg-warning/10';
    }
  };

  const getPlanColor = (plan: string) => {
    return plan === 'subscribed' ? 'default' : 'secondary';
  };

  const handleRowClick = (user: IUser) => {
    setSelectedUser(selectedUser?._id === user._id ? null : user);
  };

  const applyUserUpdate = (updated: IUser) => {
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    setFilteredUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    setSelectedUser((prev) => (prev?._id === updated._id ? updated : prev));
  };

  const handleUpdateStatus = async (user: IUser, status: UserStatus) => {
    const previous = user.status;
    const optimistic: IUser = { ...user, status };
    applyUserUpdate(optimistic);

    try {
      const res = await usersService.updateUserStatus({ id: user._id, status });
      if (res.data) {
        applyUserUpdate(res.data);
      }
      toast.success(res.message || "User status updated");
    } catch (e) {
      applyUserUpdate({ ...user, status: previous });
      toast.error(e instanceof Error ? e.message : "Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all registered users</p>
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
                <TableHead className="text-muted-foreground hidden lg:table-cell">Verified</TableHead>
                <TableHead className="text-muted-foreground w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><div className="h-10 w-10 bg-muted rounded-full animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-8 w-8 bg-muted rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow 
                    key={user._id} 
                    className={`border-border animate-slide-in cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedUser?._id === user._id ? 'bg-muted/30' : ''
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => handleRowClick(user)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {user.full_name || 'No name'}
                            </span>
                            {user.isVerified && <Check className="h-3.5 w-3.5 text-success flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground text-xs truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={getStatusColor(user.status)}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPlanColor(user.plan)}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(user.createdAt || user.created_at)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {user.isVerified ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {userStatuses.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(user, status);
                              }}
                              className={status === "deleted" ? "text-destructive" : undefined}
                            >
                              Set status: {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* User Details Card */}
        <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>User Details</SheetTitle>
            </SheetHeader>

            {selectedUser && (
              <div className="mt-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold truncate">{selectedUser.full_name || "N/A"}</h3>
                      {selectedUser.isVerified && <Check className="h-4 w-4 text-success flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{selectedUser.email}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.phone_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <Badge variant={getPlanColor(selectedUser.plan)}>{selectedUser.plan}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{selectedUser.gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interested In</p>
                    <p className="font-medium">{selectedUser.interested_in || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Verified</p>
                    <p className="font-medium">{selectedUser.is_email_verified ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Verified</p>
                    <p className="font-medium">{selectedUser.is_phone_number_verified ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Completed</p>
                    <p className="font-medium">{selectedUser.profile_completed ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{formatDate(selectedUser.createdAt || selectedUser.created_at)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedUser.bio || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-sm">{selectedUser.location?.address || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Basics</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Occupation</p>
                      <p className="text-sm font-medium">{selectedUser.basics?.occupation || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Religion</p>
                      <p className="text-sm font-medium">{selectedUser.basics?.religion || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Smoking</p>
                      <p className="text-sm font-medium">{selectedUser.basics?.smoking || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Drinking</p>
                      <p className="text-sm font-medium">{selectedUser.basics?.drinking || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Workout</p>
                      <p className="text-sm font-medium">{selectedUser.basics?.workout || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="text-sm font-medium">{selectedUser.basics?.height || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
