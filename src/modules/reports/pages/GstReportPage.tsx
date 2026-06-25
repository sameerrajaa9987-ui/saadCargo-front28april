import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getGstReport, downloadReportExport } from "../api/reportsApi";
import { formatCurrency } from "@/lib/utils";

export function GstReportPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", "gst", month, year],
    queryFn: () => getGstReport({ month, year }),
  });

  const STATUS_COLORS: Record<string, string> = {
    draft: "text-slate-500",
    sent: "text-blue-600",
    paid: "text-green-600",
    cancelled: "text-red-500",
  };

  return (
    <div className="erp-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">GST Summary</h1>
          <p className="text-sm text-muted-foreground">Monthly invoice-wise GST breakup</p>
        </div>
        <button
          onClick={() =>
            downloadReportExport(
              "gst",
              { month, year },
              `gst-report_${year}-${String(month).padStart(2, "0")}.xlsx`,
            )
          }
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          <Download className="h-4 w-4" /> Export Excel
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString("en-IN", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[2023, 2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {data?.summary && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Service Subtotal", val: data.summary.totalServiceSubtotal },
            { label: "Reimbursement", val: data.summary.totalReimbursement },
            { label: "CGST", val: data.summary.totalCgst },
            { label: "SGST", val: data.summary.totalSgst },
            { label: "IGST", val: data.summary.totalIgst },
            { label: "Grand Total", val: data.summary.grandTotal },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
              <div className="text-lg font-bold">{formatCurrency(item.val)}</div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {String(error)}
        </div>
      )}

      <div className="overflow-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm min-w-[1100px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {[
                "Bill No.",
                "Date",
                "Party",
                "GSTIN",
                "Status",
                "Reimb. (₹)",
                "Service (₹)",
                "CGST",
                "SGST",
                "IGST",
                "Gross (₹)",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !data?.rows.length && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-muted-foreground">
                  No invoices for this period
                </td>
              </tr>
            )}
            {data?.rows.map((row) => (
              <tr key={row.billNumber} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono font-semibold">{row.billNumber}</td>
                <td className="px-4 py-2.5">{row.date}</td>
                <td className="px-4 py-2.5 font-medium">{row.partyName}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{row.gstin || "-"}</td>
                <td className="px-4 py-2.5">
                  <span className={`capitalize font-medium ${STATUS_COLORS[row.status] ?? ""}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">{formatCurrency(row.reimbursementSubtotal)}</td>
                <td className="px-4 py-2.5">{formatCurrency(row.serviceSubtotal)}</td>
                <td className="px-4 py-2.5">
                  {row.cgstRate}% = {formatCurrency(row.cgstAmount)}
                </td>
                <td className="px-4 py-2.5">
                  {row.sgstRate}% = {formatCurrency(row.sgstAmount)}
                </td>
                <td className="px-4 py-2.5">
                  {row.igstRate}% = {formatCurrency(row.igstAmount)}
                </td>
                <td className="px-4 py-2.5 font-semibold">{formatCurrency(row.grossTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
