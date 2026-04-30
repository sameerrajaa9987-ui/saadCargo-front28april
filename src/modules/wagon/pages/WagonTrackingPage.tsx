import { useState } from "react";
import { ResourceListPage } from "@/modules/common/shared-crud/ResourceListPage";
import { useWagons, useDeleteWagon } from "@/modules/wagon/hooks/useWagons";
import { WagonDialog } from "@/modules/wagon/components/WagonDialog";
import type { WagonRow, WagonStatus } from "@/modules/wagon/types";
import { formatDate } from "@/shared/lib/utils";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAppSelector } from "@/app/hooks";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type WagonQuery = {
  search?: string;
  status?: WagonStatus;
  page: number;
  limit: number;
  sortBy: "createdAt";
  sortDir: "desc";
};

export function WagonTrackingPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [statusFilter, setStatusFilter] = useState<WagonStatus | "">("");

  return (
    <ResourceListPage<WagonRow, WagonQuery>
      title="Wagon Tracking"
      subtitle="Track wagon status and detect delays"
      newButtonText="Add Wagon"
      minTableWidth="min-w-[1000px]"
      emptyText="No wagons found"
      deleteConfirmText="Delete this wagon?"
      defaultSortBy="createdAt"
      hideIdColumn
      disableCreate={user?.role === "accountant"}
      hideActionsColumn={user?.role === "accountant"}
      rowClassName={(item) =>
        item.isDelayed ? "bg-red-50 dark:bg-red-900/10" : undefined
      }
      buildQuery={({ search, page, limit }) => ({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        page,
        limit,
        sortBy: "createdAt",
        sortDir: "desc",
      })}
      renderFilters={({ search, setSearch }) => (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
          <div className="relative flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-muted-foreground">
              Search
            </label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by wagon ID..."
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as WagonStatus | "")
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="arrived">Arrived</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      columns={[
        {
          header: "Wagon ID",
          getValue: (item) => item.wagonId,
          valueClassName: "font-mono font-semibold",
        },
        {
          header: "Booking",
          getValue: (item) => item.linkedBooking?.label || "—",
          valueClassName: "text-primary",
        },
        {
          header: "Route",
          getValue: (item) =>
            `${item.departureStation} → ${item.destinationStation}`,
          valueClassName: "text-muted-foreground",
        },
        {
          header: "Departure",
          getValue: (item) => formatDate(item.departureTime),
        },
        {
          header: "ETA",
          getValue: (item) => formatDate(item.expectedArrival),
        },
        {
          header: "Status",
          getValue: (item) => <StatusBadge status={item.status} />,
          valueClassName: "text-center",
        },
        {
          header: "Delayed",
          getValue: (item) =>
            item.isDelayed ? (
              <span className="inline-flex items-center gap-1 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                Yes
              </span>
            ) : (
              "—"
            ),
          valueClassName: "text-center",
        },
      ]}
      getIdValue={(item) => item.id}
      useList={
        useWagons as (query: WagonQuery) => {
          data?: {
            items: WagonRow[];
            meta: {
              total: number;
              totalPages: number;
              hasNextPage: boolean;
              hasPrevPage: boolean;
            };
          };
          isLoading: boolean;
          error: unknown;
          refetch: () => Promise<unknown>;
        }
      }
      useDelete={useDeleteWagon}
      hideDeleteButton={user?.role !== "admin"}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <WagonDialog
          open={open}
          onOpenChange={onOpenChange}
          mode={mode}
          value={value}
          onSuccess={onSuccess}
        />
      )}
    />
  );
}
