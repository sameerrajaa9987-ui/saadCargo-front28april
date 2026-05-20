import { useState } from "react";
import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { PaymentDialog } from "../components/PaymentDialog";
import { usePayments, useDeletePayment } from "../hooks/usePayments";
import { useParties } from "@/modules/party/hooks/useParties";
import { PAYMENT_MASTER_QUERIES } from "../constants/payment.queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { partyName } from "@/shared/lib/partyDisplay";
import type { Payment, PaymentListQuery } from "../types";

const MODE_LABELS: Record<string, string> = {
  cash: "Cash", bank_transfer: "Bank Transfer", cheque: "Cheque", upi: "UPI", other: "Other",
};

export function PaymentListPage() {
  const [filters, setFilters] = useState({ party: "", startDate: "", endDate: "" });
  const partiesRes = useParties(PAYMENT_MASTER_QUERIES.parties);
  const parties = partiesRes.data?.items ?? [];

  const inputCls = "rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition w-full";

  return (
    <ResourceListPage<Payment, PaymentListQuery>
      title="Payments"
      subtitle="Cash receipts from parties"
      newButtonText="Record Payment"
      minTableWidth="min-w-[800px]"
      emptyText="No payments found."
      deleteConfirmText="Delete this payment record?"
      useList={usePayments}
      useDelete={useDeletePayment}
      buildQuery={({ page, limit }) => ({
        party: filters.party || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page, limit,
        sortBy: "date", sortDir: "desc" as const,
      })}
      renderFilters={() => (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Party</label>
              <select value={filters.party} onChange={(e) => setFilters((f) => ({ ...f, party: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                <option value="">All parties</option>
                {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
              <input type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
              <input type="date" value={filters.endDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} className={inputCls} />
            </div>
          </div>
        </div>
      )}
      hideDefaultSearch
      columns={[
        { header: "Date", getValue: (p) => formatDate(p.date) },
        { header: "Party", getValue: (p) => <span className="font-medium">{partyName(p.party)}</span> },
        { header: "Mode", getValue: (p) => MODE_LABELS[p.mode] ?? p.mode },
        { header: "Reference", getValue: (p) => p.referenceNumber ? <span className="font-mono text-xs">{p.referenceNumber}</span> : "-" },
        { header: "Notes", getValue: (p) => p.notes || "-" },
        { header: "Amount (₹)", getValue: (p) => <span className="font-semibold text-green-600">{formatCurrency(p.amount)}</span> },
      ]}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <PaymentDialog open={open} onOpenChange={onOpenChange} mode={mode} value={value} onSuccess={onSuccess} parties={parties} />
      )}
    />
  );
}
