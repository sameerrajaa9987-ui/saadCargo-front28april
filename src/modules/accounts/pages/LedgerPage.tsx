import { useState } from "react";
import { ResourceListPage } from "@/modules/common/shared-crud/ResourceListPage";
import { useLedger } from "@/modules/accounts/hooks/useLedger";
import type { LedgerRow } from "@/modules/accounts/types";
import { formatPKR, formatDate } from "@/shared/lib/utils";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LedgerQuery = {
  accountType?: string;
  page: number;
  limit: number;
  sortBy: "date";
  sortDir: "desc";
};

export function LedgerPage() {
  const [accountType, setAccountType] = useState("");

  return (
    <ResourceListPage<LedgerRow, LedgerQuery>
      title="Ledger"
      subtitle="Auto-generated from all bookings, payments, and expenses"
      newButtonText=""
      minTableWidth="min-w-[1100px]"
      emptyText="No ledger entries found"
      defaultSortBy="date"
      hideIdColumn
      hideCreateButton
      hideActionsColumn
      buildQuery={({ page, limit }) => ({
        accountType: accountType || undefined,
        page,
        limit,
        sortBy: "date",
        sortDir: "desc",
      })}
      hideDefaultSearch
      renderFilters={() => (
        <div className="flex items-end gap-3 rounded-xl border border-border bg-card p-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Account Type
            </label>
            <Select
              value={accountType}
              onValueChange={(value) => setAccountType(value ?? "")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Accounts</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="railway">Railway</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
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
          header: "Description",
          getValue: (item) => item.description,
          valueClassName: "max-w-[300px] truncate",
        },
        {
          header: "Account",
          getValue: (item) => <StatusBadge status={item.accountType} />,
          valueClassName: "text-center",
        },
        {
          header: "Debit",
          getValue: (item) => (item.debit > 0 ? formatPKR(item.debit) : "—"),
          valueClassName: "text-right font-medium text-red-600",
        },
        {
          header: "Credit",
          getValue: (item) => (item.credit > 0 ? formatPKR(item.credit) : "—"),
          valueClassName: "text-right font-medium text-emerald-600",
        },
        {
          header: "Linked To",
          getValue: (item) => item.linkedEntityType || "—",
          valueClassName: "text-xs text-muted-foreground",
        },
      ]}
      getIdValue={(item) => item.id}
      useList={
        useLedger as (query: LedgerQuery) => {
          data?: {
            items: LedgerRow[];
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
    />
  );
}
