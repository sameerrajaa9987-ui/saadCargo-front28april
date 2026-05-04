import { useState } from "react";
import { ResourceListPage } from "@/modules/common/shared-crud/ResourceListPage";
import {
  usePayments,
  useDeletePayment,
} from "@/modules/payment/hooks/usePayments";
import { PaymentDialog } from "@/modules/payment/components/PaymentDialog";
import type { PaymentRow, PaymentType } from "@/modules/payment/types";
import { formatINR, formatDate } from "@/shared/lib/utils";
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

type PaymentQuery = {
  search?: string;
  type?: PaymentType;
  page: number;
  limit: number;
  sortBy: "createdAt";
  sortDir: "desc";
};

export function PaymentsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [typeFilter, setTypeFilter] = useState<PaymentType | "">("");

  return (
    <ResourceListPage<PaymentRow, PaymentQuery>
      title="Payments"
      subtitle="Track all incoming and outgoing payments"
      newButtonText="Record Payment"
      minTableWidth="min-w-[1100px]"
      emptyText="No payments found"
      deleteConfirmText="Delete this payment?"
      defaultSortBy="createdAt"
      hideIdColumn
      disableCreate={user?.role === "accountant"}
      hideActionsColumn={user?.role === "accountant"}
      buildQuery={({ search, page, limit }) => ({
        search: search.trim() || undefined,
        type: typeFilter || undefined,
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
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Type
            </label>
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as PaymentType | "")
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      columns={[
        {
          header: "Date",
          getValue: (item) => formatDate(item.date),
        },
        {
          header: "Type",
          getValue: (item) => <StatusBadge status={item.type} />,
        },
        {
          header: "Client / Vendor",
          getValue: (item) => item.clientOrVendorName,
          valueClassName: "font-medium",
        },
        {
          header: "Amount",
          getValue: (item) => formatINR(item.amount),
          valueClassName: "text-right font-semibold",
        },
        {
          header: "Mode",
          getValue: (item) => item.mode,
          valueClassName: "capitalize",
        },
        {
          header: "Booking",
          getValue: (item) => item.linkedBooking?.label || "—",
          valueClassName: "font-mono text-xs text-primary",
        },
        {
          header: "Reference",
          getValue: (item) => item.referenceNumber || "—",
          valueClassName: "text-muted-foreground",
        },
      ]}
      getIdValue={(item) => item.id}
      useList={
        usePayments as (query: PaymentQuery) => {
          data?: {
            items: PaymentRow[];
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
      useDelete={useDeletePayment}
      hideDeleteButton={user?.role !== "admin"}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <PaymentDialog
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
