import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getStationReport, downloadReportExport } from "@/modules/reports/api/reportsApi";
import { formatCurrency } from "@/lib/utils";

export function DailySummaryPage() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["consignments", "daily-summary", date],
    queryFn: () => getStationReport({ startDate: date, endDate: date }),
    enabled: Boolean(date),
  });

  const inputCls =
    "rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition";

  const totals = data
    ? {
        count: data.reduce((a, r) => a + r.consignmentCount, 0),
        packages: data.reduce((a, r) => a + r.totalPackages, 0),
        weight: data.reduce((a, r) => a + r.totalChargeableWeight, 0),
        freight: data.reduce((a, r) => a + r.totalFreight, 0),
        amount: data.reduce((a, r) => a + r.totalAmount, 0),
      }
    : null;

  return (
    <div className="erp-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Daily Summary</h1>
          <p className="text-sm text-muted-foreground">
            Station-wise consignment summary for a single day
          </p>
        </div>
        <button
          onClick={() =>
            downloadReportExport(
              "station",
              { startDate: date, endDate: date },
              `daily-summary_${date}.xlsx`,
            )
          }
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          <Download className="h-4 w-4" /> Export Excel
        </button>
      </div>

      {/* Date picker */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            onClick={() => void refetch()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={() => setDate(today)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {String(error)}
        </div>
      )}

      {/* Summary cards */}
      {totals && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            { label: "Stations", value: data!.length },
            { label: "Consignments", value: totals.count },
            { label: "Packages", value: totals.packages },
            { label: "Wt (kg)", value: totals.weight.toFixed(2) },
            { label: "Total Revenue", value: formatCurrency(totals.amount) },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-border bg-card p-4 shadow-sm text-center"
            >
              <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-lg font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {["Station", "Consignments", "Packages", "Wt (kg)", "Freight (₹)", "Total (₹)"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !data?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No consignments for {date}
                </td>
              </tr>
            )}
            {data?.map((row) => (
              <tr key={row.station} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono font-bold text-primary">{row.station}</td>
                <td className="px-4 py-2.5">{row.consignmentCount}</td>
                <td className="px-4 py-2.5">{row.totalPackages}</td>
                <td className="px-4 py-2.5">{row.totalChargeableWeight.toFixed(2)}</td>
                <td className="px-4 py-2.5">{formatCurrency(row.totalFreight)}</td>
                <td className="px-4 py-2.5 font-semibold">{formatCurrency(row.totalAmount)}</td>
              </tr>
            ))}
            {totals && data && data.length > 0 && (
              <tr className="border-t-2 border-border bg-muted/20 font-semibold">
                <td className="px-4 py-2.5">TOTAL</td>
                <td className="px-4 py-2.5">{totals.count}</td>
                <td className="px-4 py-2.5">{totals.packages}</td>
                <td className="px-4 py-2.5">{totals.weight.toFixed(2)}</td>
                <td className="px-4 py-2.5">{formatCurrency(totals.freight)}</td>
                <td className="px-4 py-2.5 text-primary">{formatCurrency(totals.amount)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
