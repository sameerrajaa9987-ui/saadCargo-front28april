import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getStationReport, downloadReportExport } from "../api/reportsApi";
import { formatCurrency } from "@/lib/utils";

export function StationReportPage() {
  const today = new Date().toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(monthAgo);
  const [endDate, setEndDate] = useState(today);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports", "station", startDate, endDate],
    queryFn: () => getStationReport({ startDate, endDate }),
    enabled: Boolean(startDate && endDate),
  });

  const inputCls =
    "rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition";

  return (
    <div className="erp-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Station-wise Report</h1>
          <p className="text-sm text-muted-foreground">Revenue breakdown by destination station</p>
        </div>
        <button
          onClick={() =>
            downloadReportExport(
              "station",
              { startDate, endDate },
              `station-report_${startDate}_to_${endDate}.xlsx`,
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
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {String(error)}
        </div>
      )}

      <div className="overflow-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {[
                "#",
                "Station",
                "Consignments",
                "Packages",
                "Weight (kg)",
                "Freight (₹)",
                "Total (₹)",
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
                <td colSpan={7} className="px-4 py-10 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !data?.length && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No data for selected range
                </td>
              </tr>
            )}
            {data?.map((row, i) => (
              <tr key={row.station} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-2.5 font-mono font-bold text-primary">{row.station}</td>
                <td className="px-4 py-2.5">{row.consignmentCount}</td>
                <td className="px-4 py-2.5">{row.totalPackages}</td>
                <td className="px-4 py-2.5">{row.totalChargeableWeight}</td>
                <td className="px-4 py-2.5">{formatCurrency(row.totalFreight)}</td>
                <td className="px-4 py-2.5 font-semibold">{formatCurrency(row.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
