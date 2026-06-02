import { useState } from "react";
import { Printer } from "lucide-react";
import { useConsignments } from "../hooks/useConsignments";
import { PAYMENT_MODE_COLORS } from "../constants/consignment.constants";
import { LOADING_LIST_DEFAULTS } from "../constants/consignment.queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { partyName } from "@/shared/lib/partyDisplay";
import { cn } from "@/lib/utils";

export function LoadingListPage() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [station, setStation] = useState("");

  const { data, isLoading, error } = useConsignments({
    startDate: date,
    endDate: date,
    destinationStation: station || undefined,
    ...LOADING_LIST_DEFAULTS,
  });

  const items = data?.items ?? [];
  const inputCls =
    "rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition";

  // Group by destination station for summary
  const stationGroups = items.reduce<Record<string, number>>((acc, c) => {
    acc[c.destinationStation] = (acc[c.destinationStation] ?? 0) + 1;
    return acc;
  }, {});

  const totalPackages = items.reduce((a, c) => a + c.packages, 0);
  const totalWeight = items.reduce((a, c) => a + c.chargeableWeight, 0);
  const totalAmount = items.reduce((a, c) => a + c.totalAmount, 0);

  return (
    <div className="erp-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Loading List</h1>
          <p className="text-sm text-muted-foreground">
            All consignments for dispatch on a given date
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600 transition-colors print:hidden"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
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
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Destination Station
            </label>
            <input
              value={station}
              onChange={(e) => setStation(e.target.value.toUpperCase())}
              placeholder="All stations"
              className={`${inputCls} uppercase`}
            />
          </div>
          <button
            onClick={() => setDate(today)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive print:hidden">
          {String(error)}
        </div>
      )}

      {/* Print header (hidden on screen) */}
      <div className="hidden print:block mb-4">
        <h2 className="text-lg font-bold">Loading List — {formatDate(date)}</h2>
        {station && <p className="text-sm">Station: {station}</p>}
        <p className="text-sm text-gray-500">
          Total: {items.length} consignments | {totalPackages} packages | {totalWeight.toFixed(2)}{" "}
          kg | {formatCurrency(totalAmount)}
        </p>
      </div>

      {/* Summary strip */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-3 print:hidden">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm text-sm">
            <span className="text-muted-foreground">Total Consignments:</span>
            <span className="font-bold text-foreground">{items.length}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm text-sm">
            <span className="text-muted-foreground">Packages:</span>
            <span className="font-bold">{totalPackages}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm text-sm">
            <span className="text-muted-foreground">Weight:</span>
            <span className="font-bold">{totalWeight.toFixed(2)} kg</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-bold text-primary">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm text-sm">
            <span className="text-muted-foreground">Stations:</span>
            {Object.entries(stationGroups).map(([st, cnt]) => (
              <span
                key={st}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
              >
                {st} <span className="text-muted-foreground font-normal">({cnt})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm min-w-[1100px] print:min-w-0">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {[
                "#",
                "RR No.",
                "Station",
                "Party",
                "Train No.",
                "Pkgs",
                "Wt (kg)",
                "Contents",
                "Mode",
                "Amount (₹)",
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
                <td colSpan={10} className="px-4 py-10 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                  No consignments for {formatDate(date)}
                  {station ? ` to ${station}` : ""}
                </td>
              </tr>
            )}
            {items.map((c, idx) => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 text-muted-foreground">{idx + 1}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{c.railwayReceiptNumber || "—"}</td>
                <td className="px-4 py-2.5">
                  <span className="font-mono font-bold text-primary">{c.destinationStation}</span>
                </td>
                <td className="px-4 py-2.5 font-medium">{partyName(c.party)}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{c.trainNumber || "—"}</td>
                <td className="px-4 py-2.5">{c.packages}</td>
                <td className="px-4 py-2.5">{c.chargeableWeight.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-muted-foreground max-w-[120px] truncate">
                  {c.contents ?? "—"}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      PAYMENT_MODE_COLORS[c.paymentMode] ?? "",
                    )}
                  >
                    {c.paymentMode.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-semibold">{formatCurrency(c.totalAmount)}</td>
              </tr>
            ))}
            {items.length > 0 && (
              <tr className="border-t-2 border-border bg-muted/20 font-semibold">
                <td colSpan={5} className="px-4 py-2.5">
                  TOTAL
                </td>
                <td className="px-4 py-2.5">{totalPackages}</td>
                <td className="px-4 py-2.5">{totalWeight.toFixed(2)}</td>
                <td colSpan={2} className="px-4 py-2.5" />
                <td className="px-4 py-2.5 text-primary">{formatCurrency(totalAmount)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
