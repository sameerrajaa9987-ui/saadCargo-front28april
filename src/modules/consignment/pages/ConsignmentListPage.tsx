import { useState } from "react";
import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { ConsignmentDialog } from "../components/ConsignmentDialog";
import { useConsignments, useDeleteConsignment } from "../hooks/useConsignments";
import { useParties } from "@/modules/party/hooks/useParties";
import { PAYMENT_MODES, PAYMENT_STATUSES, PAYMENT_MODE_COLORS, PAYMENT_STATUS_COLORS } from "../constants/consignment.constants";
import { CONSIGNMENT_MASTER_QUERIES } from "../constants/consignment.queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { partyName } from "@/shared/lib/partyDisplay";
import type { Consignment, ConsignmentListQuery } from "../types";

export function ConsignmentListPage() {
  const [filters, setFilters] = useState({ party: "", paymentMode: "", paymentStatus: "", startDate: "", endDate: "" });

  const partiesRes = useParties(CONSIGNMENT_MASTER_QUERIES.parties);
  const parties = partiesRes.data?.items ?? [];

  const inputCls = "rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition w-full";
  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <ResourceListPage<Consignment, ConsignmentListQuery>
      title="Consignments"
      subtitle="Daily railway parcel entries"
      newButtonText="New Consignment"
      minTableWidth="min-w-[1400px]"
      emptyText="No consignments found."
      deleteConfirmText="Delete this consignment permanently?"
      useList={useConsignments}
      useDelete={useDeleteConsignment}
      buildQuery={({ search, page, limit }) => ({
        search: search || undefined,
        party: filters.party || undefined,
        paymentMode: filters.paymentMode || undefined,
        paymentStatus: filters.paymentStatus || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page,
        limit,
        sortBy: "date",
        sortDir: "desc" as const,
      })}
      renderFilters={({ search, setSearch }) => (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Search</label>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="RR number, station, contents..." className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Party</label>
              <select value={filters.party} onChange={(e) => setFilters((f) => ({ ...f, party: e.target.value }))} className={selectCls}>
                <option value="">All parties</option>
                {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Payment Mode</label>
              <select value={filters.paymentMode} onChange={(e) => setFilters((f) => ({ ...f, paymentMode: e.target.value }))} className={selectCls}>
                <option value="">All modes</option>
                {PAYMENT_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
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
      columns={[
        { header: "Date", getValue: (c) => formatDate(c.date) },
        { header: "Party", getValue: (c) => <span className="font-medium">{partyName(c.party)}</span> },
        { header: "Destination", getValue: (c) => <span className="font-mono font-semibold text-primary">{c.destinationStation}</span> },
        { header: "Pkgs", getValue: (c) => c.packages },
        { header: "Wt (kg)", getValue: (c) => c.chargeableWeight },
        { header: "RR No.", getValue: (c) => c.railwayReceiptNumber ? <span className="font-mono text-xs">{c.railwayReceiptNumber}</span> : "-" },
        { header: "Mode", getValue: (c) => <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_MODE_COLORS[c.paymentMode] ?? ""}`}>{PAYMENT_MODES.find((m) => m.value === c.paymentMode)?.label ?? c.paymentMode}</span> },
        { header: "Status", getValue: (c) => <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS_COLORS[c.paymentStatus] ?? ""}`}>{c.paymentStatus}</span> },
        { header: "Total (₹)", getValue: (c) => <span className="font-semibold">{formatCurrency(c.totalAmount)}</span> },
      ]}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <ConsignmentDialog open={open} onOpenChange={onOpenChange} mode={mode} value={value} onSuccess={onSuccess} parties={parties} />
      )}
    />
  );
}
