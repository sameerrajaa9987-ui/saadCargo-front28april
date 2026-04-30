import { useState } from "react";
import { ResourceListPage } from "@/modules/common/shared-crud/ResourceListPage";
import {
  useInventory,
  useDeleteInventory,
} from "@/modules/inventory/hooks/useInventory";
import { InventoryDialog } from "@/modules/inventory/components/InventoryDialog";
import type { InventoryRow, InventoryStatus } from "@/modules/inventory/types";
import { formatDate } from "@/shared/lib/utils";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAppSelector } from "@/app/hooks";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InventoryQuery = {
  search?: string;
  status?: InventoryStatus;
  page: number;
  limit: number;
  sortBy: "createdAt";
  sortDir: "desc";
};

export function InventoryPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "">("");

  return (
    <ResourceListPage<InventoryRow, InventoryQuery>
      title="Inventory"
      subtitle="Real-time goods tracking. Auto-updates on wagon status changes."
      newButtonText="Add Item"
      minTableWidth="min-w-[900px]"
      emptyText="No inventory items found"
      deleteConfirmText="Delete this inventory item?"
      defaultSortBy="createdAt"
      hideIdColumn
      disableCreate={user?.role === "accountant"}
      hideActionsColumn={user?.role === "accountant"}
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
              placeholder="Search items..."
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
                setStatusFilter(value as InventoryStatus | "")
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      columns={[
        {
          header: "Item",
          getValue: (item) => item.itemName,
          valueClassName: "font-medium",
        },
        {
          header: "Booking",
          getValue: (item) => item.booking?.label || "—",
          valueClassName: "text-primary",
        },
        {
          header: "Qty",
          getValue: (item) => item.quantity,
          valueClassName: "text-right font-medium",
        },
        {
          header: "Unit",
          getValue: (item) => item.unit,
        },
        {
          header: "Location",
          getValue: (item) => item.location || "—",
          valueClassName: "text-muted-foreground",
        },
        {
          header: "Status",
          getValue: (item) => <StatusBadge status={item.status} />,
          valueClassName: "text-center",
        },
        {
          header: "Last Updated",
          getValue: (item) => formatDate(item.lastUpdated),
        },
      ]}
      getIdValue={(item) => item.id}
      useList={
        useInventory as (query: InventoryQuery) => {
          data?: {
            items: InventoryRow[];
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
      useDelete={useDeleteInventory}
      hideDeleteButton={user?.role !== "admin"}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <InventoryDialog
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
