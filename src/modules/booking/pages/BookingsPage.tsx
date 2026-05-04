import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResourceListPage } from "@/modules/common/shared-crud/ResourceListPage";
import {
  useBookings,
  useDeleteBooking,
} from "@/modules/booking/hooks/useBookings";
import { BookingDialog } from "@/modules/booking/components/BookingDialog";
import type {
  BookingRow,
  BookingStatus,
  PaymentStatus,
} from "@/modules/booking/types";
import { formatINR, formatDate } from "@/shared/lib/utils";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAppSelector } from "@/app/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { http } from "@/shared/api/http";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookingQuery = {
  search?: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  page: number;
  limit: number;
  sortBy: "createdAt";
  sortDir: "desc";
};

export function BookingsPage() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "">("");

  async function downloadInvoice(booking: BookingRow) {
    try {
      const res = await http.get(`/bookings/${booking.id}/invoice`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${booking.invoiceNumber || booking.bookingId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      console.error("Failed to download invoice");
    }
  }

  return (
    <ResourceListPage<BookingRow, BookingQuery>
      title="Bookings"
      subtitle="Manage client shipment bookings"
      newButtonText="New Booking"
      minTableWidth="min-w-[1200px]"
      emptyText="No bookings found"
      deleteConfirmText="Delete this booking?"
      defaultSortBy="createdAt"
      hideIdColumn
      disableCreate={user?.role === "accountant"}
      hideActionsColumn={user?.role === "accountant"}
      buildQuery={({ search, page, limit }) => ({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined,
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
              placeholder="Search bookings..."
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
                setStatusFilter(value as BookingStatus | "")
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Payment
            </label>
            <Select
              value={paymentFilter}
              onValueChange={(value) =>
                setPaymentFilter(value as PaymentStatus | "")
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Payment</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      columns={[
        {
          header: "Booking ID",
          getValue: (item) => item.bookingId,
          valueClassName: "font-mono text-xs font-semibold text-primary",
        },
        {
          header: "Client",
          getValue: (item) => item.client?.label || "—",
        },
        {
          header: "Route",
          getValue: (item) =>
            `${item.sourceStation} → ${item.destinationStation}`,
          valueClassName: "text-muted-foreground",
        },
        {
          header: "Type",
          getValue: (item) => item.parcelType,
          valueClassName: "text-muted-foreground",
        },
        {
          header: "Selling",
          getValue: (item) => formatINR(item.sellingPrice),
          valueClassName: "text-right font-medium",
        },
        {
          header: "Profit",
          getValue: (item) => formatINR(item.profit),
          valueClassName: (item) =>
            item.profit > 0
              ? "text-right font-medium text-emerald-600 dark:text-emerald-400"
              : item.profit < 0
                ? "text-right font-medium text-red-600 dark:text-red-400"
                : "text-right font-medium text-foreground",
        },
        {
          header: "Status",
          getValue: (item) => <StatusBadge status={item.status} />,
          valueClassName: "text-center",
        },
        {
          header: "Payment",
          getValue: (item) => <StatusBadge status={item.paymentStatus} />,
          valueClassName: "text-center",
        },
        {
          header: "Date",
          getValue: (item) => formatDate(item.createdAt),
          valueClassName: "text-muted-foreground",
        },
        {
          header: "Actions",
          getValue: (item) => (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/bookings/${item.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              {item.invoiceNumber && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadInvoice(item)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Invoice
                </Button>
              )}
            </div>
          ),
          valueClassName: "text-center",
        },
      ]}
      getIdValue={(item) => item.id}
      useList={
        useBookings as (query: BookingQuery) => {
          data?: {
            items: BookingRow[];
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
      useDelete={useDeleteBooking}
      hideDeleteButton={user?.role !== "admin"}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <BookingDialog
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
