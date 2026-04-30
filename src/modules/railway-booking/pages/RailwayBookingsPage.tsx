import { ResourceListPage } from "@/modules/common/shared-crud/ResourceListPage";
import {
  useRailwayBookings,
  useDeleteRailwayBooking,
} from "@/modules/railway-booking/hooks/useRailwayBookings";
import { RailwayBookingDialog } from "@/modules/railway-booking/components/RailwayBookingDialog";
import type { RailwayBookingRow } from "@/modules/railway-booking/types";
import { formatPKR, formatDate } from "@/shared/lib/utils";
import { useAppSelector } from "@/app/hooks";

type RailwayBookingQuery = {
  search?: string;
  page: number;
  limit: number;
  sortBy: "createdAt";
  sortDir: "desc";
};

export function RailwayBookingsPage() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <ResourceListPage<RailwayBookingRow, RailwayBookingQuery>
      title="Railway Bookings"
      subtitle="Space purchased from railway portal"
      newButtonText="New Railway Booking"
      minTableWidth="min-w-[900px]"
      emptyText="No railway bookings found"
      deleteConfirmText="Delete this railway booking?"
      defaultSortBy="createdAt"
      hideIdColumn
      disableCreate={user?.role === "accountant"}
      hideActionsColumn={user?.role === "accountant"}
      buildQuery={({ search, page, limit }) => ({
        search: search.trim() || undefined,
        page,
        limit,
        sortBy: "createdAt",
        sortDir: "desc",
      })}
      columns={[
        {
          header: "Ref Number",
          getValue: (item) => item.referenceNumber,
          valueClassName: "font-mono font-semibold text-primary",
        },
        {
          header: "Space",
          getValue: (item) => item.spacePurchased || "—",
        },
        {
          header: "Cost Paid",
          getValue: (item) => formatPKR(item.costPaid),
          valueClassName: "text-right font-medium",
        },
        {
          header: "Linked Booking",
          getValue: (item) => item.linkedBooking?.label || "—",
          valueClassName: "text-muted-foreground",
        },
        {
          header: "Date",
          getValue: (item) => formatDate(item.date),
        },
      ]}
      getIdValue={(item) => item.id}
      useList={
        useRailwayBookings as (query: RailwayBookingQuery) => {
          data?: {
            items: RailwayBookingRow[];
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
      useDelete={useDeleteRailwayBooking}
      hideDeleteButton={user?.role !== "admin"}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <RailwayBookingDialog
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
