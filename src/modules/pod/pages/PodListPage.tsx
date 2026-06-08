import { useState } from "react";
import { ExternalLink, Share2 } from "lucide-react";
import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { usePods, useDeletePod, useUpdatePodStatus } from "../hooks/usePods";
import { getPodPdfPath } from "../api/podApi";
import { openAuthenticatedPdf } from "@/shared/lib/openAuthenticatedPdf";
import { shareDocument } from "@/shared/lib/shareDocument";
import { PodDialog } from "../components/PodDialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Pod, PodListQuery } from "../types";

const STATUSES = [
  { value: "received", label: "Received" },
  { value: "loaded", label: "Loaded" },
  { value: "in_transit", label: "In Transit" },
  { value: "unloaded", label: "Unloaded" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
];

const STATUS_COLORS: Record<string, string> = {
  received: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  loaded: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  in_transit: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  unloaded: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  returned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function PodListPage() {
  const [filters, setFilters] = useState({ deliveryStatus: "", startDate: "", endDate: "" });
  const statusMutation = useUpdatePodStatus();
  const inputCls =
    "rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition w-full";

  return (
    <ResourceListPage<Pod, PodListQuery>
      title="POD / Bilti"
      subtitle="Proof of delivery receipts (bilti)"
      newButtonText="New Bilti"
      searchPlaceholder="Consignor, consignee, station..."
      minTableWidth="min-w-[1300px]"
      emptyText="No PODs found."
      deleteConfirmText="Delete this bilti?"
      useList={usePods}
      useDelete={useDeletePod}
      buildQuery={({ search, page, limit }) => ({
        search: search || undefined,
        deliveryStatus: filters.deliveryStatus || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page,
        limit,
        sortBy: "date",
        sortDir: "desc" as const,
      })}
      renderFilters={({ search, setSearch }) => (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Consignor / consignee..."
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
              <select
                value={filters.deliveryStatus}
                onChange={(e) => setFilters((f) => ({ ...f, deliveryStatus: e.target.value }))}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      )}
      columns={[
        {
          header: "Bilti No.",
          getValue: (p) => <span className="font-mono font-semibold">#{p.podNumber}</span>,
        },
        { header: "Date", getValue: (p) => formatDate(p.date) },
        {
          header: "Consignor",
          getValue: (p) => <span className="font-medium">{p.consignorName}</span>,
        },
        { header: "Consignee", getValue: (p) => p.consigneeName },
        {
          header: "Destination",
          getValue: (p) => (
            <span className="font-mono text-primary font-semibold">{p.destinationStation}</span>
          ),
        },
        { header: "Pkgs", getValue: (p) => p.packages },
        {
          header: "Status",
          getValue: (p) => (
            <select
              value={p.deliveryStatus}
              onChange={(e) => {
                const status = STATUSES.find((s) => s.value === e.target.value);
                statusMutation.mutate({
                  id: p.id,
                  deliveryStatus: e.target.value,
                  statusLabel: status?.label ?? e.target.value,
                  mobile: p.consigneeMobile || p.consignorMobile,
                });
                // TODO: actually send status SMS via msg91 (to be implemented)
              }}
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer focus:outline-none",
                STATUS_COLORS[p.deliveryStatus] ?? "",
              )}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          ),
        },
        { header: "Total (₹)", getValue: (p) => formatCurrency(p.totalAmount) },
      ]}
      renderDialog={(props) => <PodDialog {...props} />}
      renderActions={(pod, onEdit) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(pod)}
            className="flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() =>
              shareDocument({
                path: getPodPdfPath(pod.id),
                filename: `bilti-${pod.podNumber}.pdf`,
                title: `Bilti #${pod.podNumber}`,
                message:
                  `Saad Cargo Services\n` +
                  `Bilti No: ${pod.podNumber}\n` +
                  `Date: ${formatDate(pod.date)}\n` +
                  `From: ${pod.consignorName}\n` +
                  `To: ${pod.consigneeName} (${pod.destinationStation})\n` +
                  `Packages: ${pod.packages}\n` +
                  `Total: ${formatCurrency(pod.totalAmount)}\n\n` +
                  `Receipt attached.`,
                phone: pod.consignorMobile,
              })
            }
            className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs text-white hover:bg-emerald-500 transition-colors"
            title="Share via WhatsApp"
          >
            <Share2 className="h-3 w-3" /> Share
          </button>
          <button
            onClick={() =>
              openAuthenticatedPdf(getPodPdfPath(pod.id), {
                filename: `bilti-${pod.podNumber}.pdf`,
              })
            }
            className="flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs hover:bg-accent transition-colors"
            title="Open PDF"
          >
            <ExternalLink className="h-3 w-3" /> PDF
          </button>
        </div>
      )}
    />
  );
}
