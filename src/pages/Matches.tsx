import { useEffect, useState } from "react";
import { Search } from "lucide-react";
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
import { matchesService, IMatch } from "@/services/matches";
import { toast } from "sonner";

export default function Matches() {
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<IMatch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<IMatch | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await matchesService.getAllMatches();
        setMatches(res.data);
        setFilteredMatches(res.data);
      } catch (e) {
        console.error("Failed to fetch matches:", e);
        toast.error(e instanceof Error ? e.message : "Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredMatches(matches);
      return;
    }

    setFilteredMatches(
      matches.filter(
        (m) =>
          m.full_name1?.toLowerCase().includes(q) ||
          m.full_name2?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, matches]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRowClick = (match: IMatch) => {
    setSelectedMatch((prev) => (prev?._id === match._id ? null : match));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground mt-1">View and monitor all user matches</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Pair</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Created</TableHead>
                <TableHead className="text-muted-foreground w-[120px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                        <div className="h-10 w-10 bg-muted rounded-full animate-pulse -ml-4" />
                        <div className="flex-1">
                          <div className="h-4 w-48 bg-muted rounded animate-pulse mb-2" />
                          <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredMatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    No matches found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMatches.map((match, index) => (
                  <TableRow
                    key={match._id}
                    className={`border-border animate-slide-in cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedMatch?._id === match._id ? "bg-muted/30" : ""
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => handleRowClick(match)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center">
                          <img
                            src={match.avatar1}
                            alt={match.full_name1}
                            className="h-10 w-10 rounded-full object-cover border border-border"
                          />
                          <img
                            src={match.avatar2}
                            alt={match.full_name2}
                            className="h-10 w-10 rounded-full object-cover border border-border -ml-4"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {match.full_name1} 
                            <span className="text-muted-foreground">&</span> {match.full_name2}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{match._id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(match.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-success/30 text-success bg-success/10">
                        matched
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Sheet open={!!selectedMatch} onOpenChange={(open) => !open && setSelectedMatch(null)}>
          <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Match Details</SheetTitle>
            </SheetHeader>

            {selectedMatch && (
              <div className="mt-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold truncate">
                      {selectedMatch.full_name1} & {selectedMatch.full_name2}
                    </h3>
                    <p className="text-sm text-muted-foreground">Created {formatDate(selectedMatch.createdAt)}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">{selectedMatch._id}</p>
                  </div>
                  <Badge variant="outline" className="border-success/30 text-success bg-success/10">
                    matched
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedMatch.avatar1}
                        alt={selectedMatch.full_name1}
                        className="h-12 w-12 rounded-full object-cover border border-border"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">User 1</p>
                        <p className="font-medium truncate">{selectedMatch.full_name1}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedMatch.avatar2}
                        alt={selectedMatch.full_name2}
                        className="h-12 w-12 rounded-full object-cover border border-border"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">User 2</p>
                        <p className="font-medium truncate">{selectedMatch.full_name2}</p>
                      </div>
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
