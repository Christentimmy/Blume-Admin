import { useEffect, useMemo, useState } from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  IPendingVerification,
  verificationService,
} from "@/services/verification";
import { toast } from "sonner";

export default function Verification() {
  const [items, setItems] = useState<IPendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<IPendingVerification | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await verificationService.getAllPendingVerifications();
        setItems(res.data);
      } catch (e) {
        console.error("Failed to fetch pending verifications:", e);
        toast.error(e instanceof Error ? e.message : "Failed to load pending verifications");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (x) =>
        x.full_name?.toLowerCase().includes(q) ||
        x.email?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "border-warning/30 text-warning bg-warning/10";
      case "approved":
        return "border-success/30 text-success bg-success/10";
      case "rejected":
        return "border-destructive/30 text-destructive bg-destructive/10";
      default:
        return "border-muted-foreground/30 text-muted-foreground bg-muted";
    }
  };

  const handleRowClick = (item: IPendingVerification) => {
    setSelected((prev) => (prev?.userId === item.userId ? null : item));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verification</h1>
          <p className="text-muted-foreground mt-1">Pending user verification requests</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Requested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 w-40 bg-muted rounded animate-pulse mb-2" />
                          <div className="h-3 w-56 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    No pending verifications found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item, index) => (
                  <TableRow
                    key={`${item.userId}-${item.createdAt}`}
                    className={`border-border animate-slide-in cursor-pointer hover:bg-muted/50 transition-colors ${
                      selected?.userId === item.userId ? "bg-muted/30" : ""
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => handleRowClick(item)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                          {item.avatar ? (
                            <img src={item.avatar} alt={item.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{item.full_name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusClass(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Verification Request</SheetTitle>
            </SheetHeader>

            {selected && (
              <div className="mt-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold truncate">{selected.full_name || "N/A"}</h3>
                    <p className="text-sm text-muted-foreground truncate">{selected.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">User ID: {selected.userId}</p>
                  </div>
                  <Badge variant="outline" className={statusClass(selected.status)}>
                    {selected.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Document</p>
                  <div className="rounded-xl border border-border overflow-hidden bg-black">
                    <video
                      controls
                      className="w-full h-auto max-h-[520px]"
                      src={selected.document}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Uploaded: {formatDate(selected.createdAt)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="text-sm">{selected.reason || "N/A"}</p>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
