import { useState } from "react";
import { CheckCircle2, XCircle, Send, ExternalLink, Share2 } from "lucide-react";
import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { useInvoices, useDeleteInvoice, useFinalizeInvoice, useMarkPaidInvoice, useCancelInvoice } from "../hooks/useInvoices";
import { useParties } from "@/modules/party/hooks/useParties";
import { INVOICE_MASTER_QUERIES } from "../constants/invoice.queries";
import { InvoiceDialog } from "../components/InvoiceDialog";
import { getInvoicePdfPath } from "../api/invoiceApi";
import { openAuthenticatedPdf } from "@/shared/lib/openAuthenticatedPdf";
import { shareDocument } from "@/shared/lib/shareDocument";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice, InvoiceListQuery } from "../types";
import { cn } from "@/lib/utils";
import { partyName } from "@/shared/lib/partyDisplay";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function InvoiceListPage() {
  const [filters, setFilters] = useState({ party: "", status: "", startDate: "", endDate: "" });
  const partiesRes = useParties(INVOICE_MASTER_QUERIES.parties);
  const parties = partiesRes.data?.items ?? [];
  const finalizeMutation = useFinalizeInvoice();
  const markPaidMutation = useMarkPaidInvoice();
  const cancelMutation = useCancelInvoice();

  const inputCls = "rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition w-full";

  return (
    <ResourceListPage<Invoice, InvoiceListQuery>
      title="GST Invoices"
      subtitle="Monthly credit invoices for on-bill parties"
      newButtonText="New Invoice"
      minTableWidth="min-w-[1200px]"
      emptyText="No invoices found."
      deleteConfirmText="Delete this draft invoice?"
      useList={useInvoices}
      useDelete={useDeleteInvoice}
      buildQuery={({ page, limit }) => ({
        party: filters.party || undefined,
        status: filters.status || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page, limit, sortBy: "billNumberRaw", sortDir: "desc" as const,
      })}
      hideDefaultSearch
      renderFilters={() => (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Party</label>
              <select value={filters.party} onChange={(e) => setFilters((f) => ({ ...f, party: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                <option value="">All parties</option>
                {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
              <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                <option value="">All statuses</option>
                {["draft", "sent", "paid", "cancelled"].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
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
        { header: "Bill No.", getValue: (inv) => <span className="font-mono font-semibold">{inv.billNumber}</span> },
        { header: "Date", getValue: (inv) => formatDate(inv.date) },
        { header: "Party", getValue: (inv) => <span className="font-medium">{partyName(inv.party)}</span> },
        { header: "Status", getValue: (inv) => <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", STATUS_COLORS[inv.status] ?? "")}>{inv.status}</span> },
        { header: "Consignments", getValue: (inv) => inv.consignments.length },
        { header: "Service (₹)", getValue: (inv) => formatCurrency(inv.serviceSubtotal) },
        { header: "CGST (₹)", getValue: (inv) => formatCurrency(inv.cgstAmount) },
        { header: "SGST (₹)", getValue: (inv) => formatCurrency(inv.sgstAmount) },
        { header: "Gross Total (₹)", getValue: (inv) => <span className="font-semibold">{formatCurrency(inv.grossTotal)}</span> },
      ]}
      renderDialog={(props) => <InvoiceDialog {...props} />}
      renderActions={(inv, onEdit) => (
        <div className="flex flex-wrap items-center gap-1">
          {inv.status === "draft" && (
            <>
              <button onClick={() => onEdit(inv)} className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs hover:bg-accent transition-colors">
                Edit
              </button>
              <button onClick={() => finalizeMutation.mutate(inv.id)} disabled={finalizeMutation.isPending} className="flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-xs text-white hover:bg-blue-500 transition-colors disabled:opacity-50">
                <Send className="h-3 w-3" /> Finalize
              </button>
            </>
          )}
          {inv.status === "sent" && (
            <button onClick={() => markPaidMutation.mutate(inv.id)} disabled={markPaidMutation.isPending} className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1.5 text-xs text-white hover:bg-green-500 transition-colors disabled:opacity-50">
              <CheckCircle2 className="h-3 w-3" /> Mark Paid
            </button>
          )}
          {(inv.status === "draft" || inv.status === "sent") && (
            <button onClick={() => cancelMutation.mutate(inv.id)} disabled={cancelMutation.isPending} className="flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/20 transition-colors">
              <XCircle className="h-3 w-3" /> Cancel
            </button>
          )}
          <button
            onClick={() => {
              const partyData = typeof inv.party === "object" && inv.party ? inv.party : null;
              const recipient = partyData?.name ?? inv.partySnapshot?.name ?? "Customer";
              const phone = partyData?.mobile;
              shareDocument({
                path: getInvoicePdfPath(inv.id),
                filename: `invoice-${inv.billNumber}.pdf`,
                title: `Invoice ${inv.billNumber}`,
                message:
                  `Saad Cargo Services\n` +
                  `Bill No: ${inv.billNumber}\n` +
                  `Party: ${recipient}\n` +
                  `Amount: ${formatCurrency(inv.grossTotal)}\n` +
                  `Date: ${formatDate(inv.date)}\n\n` +
                  `Kindly make payment at the earliest.\n` +
                  `Thank you.`,
                phone,
              });
            }}
            className="flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1.5 text-xs text-white hover:bg-emerald-500 transition-colors"
            title="Share via WhatsApp"
          >
            <Share2 className="h-3 w-3" /> Share
          </button>
          <button
            onClick={() => openAuthenticatedPdf(getInvoicePdfPath(inv.id), { filename: `invoice-${inv.billNumber}.pdf` })}
            className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs hover:bg-accent transition-colors"
            title="Open PDF"
          >
            <ExternalLink className="h-3 w-3" /> PDF
          </button>
        </div>
      )}
    />
  );
}
