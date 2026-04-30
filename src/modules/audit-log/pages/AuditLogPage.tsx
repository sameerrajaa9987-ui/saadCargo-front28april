import { useState } from "react";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { formatDateTime } from "@/shared/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RefreshCw } from "lucide-react";

export function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const query = {
    page,
    limit,
    action: actionFilter || undefined,
    entityType: entityFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  };

  const { data, isLoading, error, refetch } = useAuditLogs(query);
  const items = data?.items ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  function buildPageItems(
    currentPage: number,
    totalPages: number,
  ): Array<number | "ellipsis"> {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  }

  const pageItems = buildPageItems(page, totalPages);
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">
            Track all user actions and system changes
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Action
          </label>
          <Select
            value={actionFilter}
            onValueChange={(v) => setActionFilter(v ?? "")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              <SelectItem value="CREATE_BOOKING">Create Booking</SelectItem>
              <SelectItem value="UPDATE_BOOKING">Update Booking</SelectItem>
              <SelectItem value="DELETE_BOOKING">Delete Booking</SelectItem>
              <SelectItem value="CREATE_PAYMENT">Create Payment</SelectItem>
              <SelectItem value="UPDATE_PAYMENT">Update Payment</SelectItem>
              <SelectItem value="DELETE_PAYMENT">Delete Payment</SelectItem>
              <SelectItem value="CREATE_USER">Create User</SelectItem>
              <SelectItem value="UPDATE_USER">Update User</SelectItem>
              <SelectItem value="DELETE_USER">Delete User</SelectItem>
              <SelectItem value="RESET_PASSWORD">Reset Password</SelectItem>
              <SelectItem value="CREATE_RAILWAY_BOOKING">
                Create Railway Booking
              </SelectItem>
              <SelectItem value="UPDATE_RAILWAY_BOOKING">
                Update Railway Booking
              </SelectItem>
              <SelectItem value="DELETE_RAILWAY_BOOKING">
                Delete Railway Booking
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Entity
          </label>
          <Select
            value={entityFilter}
            onValueChange={(v) => setEntityFilter(v ?? "")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Entities</SelectItem>
              <SelectItem value="Booking">Booking</SelectItem>
              <SelectItem value="Payment">Payment</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="RailwayBooking">Railway Booking</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            From
          </label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[150px]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            To
          </label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[150px]"
          />
        </div>
        <Button onClick={() => setPage(1)}>Apply Filters</Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Failed to load audit logs
        </div>
      )}

      <div className="overflow-auto rounded-xl border border-border bg-card shadow-sm min-h-[420px]">
        <Table className="min-w-[1000px]">
          <TableHeader className="bg-muted/35">
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-[288px] text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm">
                    {formatDateTime(item.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">
                        {item.user?.label || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.user?.email || "—"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {item.action}
                    </span>
                  </TableCell>
                  <TableCell>{item.entityType}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {item.entityId || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.ipAddress}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {rangeStart} - {rangeEnd} of {total}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Rows per page:</span>
          <Select
            value={String(limit)}
            onValueChange={(v) => {
              setLimit(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[90px]">
              <SelectValue placeholder="50" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full overflow-x-auto md:w-auto">
          <Pagination className="mx-0 w-max min-w-full justify-start md:min-w-0 md:w-auto md:justify-end">
            <PaginationContent className="flex-nowrap">
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(1);
                  }}
                  className={
                    !hasPrevPage ? "pointer-events-none opacity-50" : undefined
                  }
                >
                  First
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasPrevPage) setPage((p) => p - 1);
                  }}
                  className={
                    !hasPrevPage ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
              {pageItems.map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasNextPage) setPage((p) => p + 1);
                  }}
                  className={
                    !hasNextPage ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(totalPages);
                  }}
                  className={
                    !hasNextPage ? "pointer-events-none opacity-50" : undefined
                  }
                >
                  Last
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
