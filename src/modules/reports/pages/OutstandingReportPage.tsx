import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getOutstandingReport, downloadReportExport } from "../api/reportsApi";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Outstanding Report — party-wise pending dues with aging buckets.
 *
 * Aging is computed server-side from each consignment's date relative to today.
 * Buckets: 0-30, 31-60, 61-90, 90+ days. The 90+ bucket is highlighted red
 * because anything that old needs immediate collection action or write-off.
 */
export function OutstandingReportPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", "outstanding"],
    queryFn: getOutstandingReport,
  });

  const meta = data?.meta;
  const rows = data?.rows ?? [];

  return (
    <div className="erp-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Outstanding Report</h1>
          <p className="text-sm text-muted-foreground">
            Party-wise pending amounts, aged by consignment date
          </p>
        </div>
        <button
          onClick={() => downloadReportExport("outstanding", {}, "outstanding-report.xlsx")}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          <Download className="h-4 w-4" /> Export Excel
        </button>
      </div>

      {/* Aging summary tiles */}
      {meta && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <SummaryTile label="Total Outstanding" value={meta.grandTotal} tone="muted" emphasis />
          <SummaryTile label="0–30 Days" value={meta.aged0to30} tone="ok" />
          <SummaryTile label="31–60 Days" value={meta.aged31to60} tone="watch" />
          <SummaryTile label="61–90 Days" value={meta.aged61to90} tone="warn" />
          <SummaryTile label="90+ Days" value={meta.aged90Plus} tone="bad" />
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
              <Th>Party</Th>
              <Th>City</Th>
              <Th>Mobile</Th>
              <Th align="right">Consignments</Th>
              <Th align="right">0–30 Days</Th>
              <Th align="right">31–60 Days</Th>
              <Th align="right">61–90 Days</Th>
              <Th align="right">90+ Days</Th>
              <Th align="right">Total (₹)</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !rows.length && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                  No outstanding amounts. Everyone's paid up.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.partyId} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-medium">{row.partyName}</td>
                <td className="px-4 py-2.5">{row.partyCity || "-"}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{row.mobile || "-"}</td>
                <td className="px-4 py-2.5 text-right">{row.consignmentCount}</td>
                <Cell amount={row.aged0to30} />
                <Cell
                  amount={row.aged31to60}
                  muted={false}
                  className="text-yellow-700 dark:text-yellow-400"
                />
                <Cell
                  amount={row.aged61to90}
                  muted={false}
                  className="text-orange-700 dark:text-orange-400"
                />
                <Cell
                  amount={row.aged90Plus}
                  muted={false}
                  className="text-red-700 dark:text-red-400 font-semibold"
                />
                <td className="px-4 py-2.5 text-right font-semibold text-destructive">
                  {formatCurrency(row.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      {children}
    </th>
  );
}

function Cell({
  amount,
  muted = true,
  className,
}: {
  amount: number;
  muted?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-4 py-2.5 text-right font-mono text-xs tabular-nums",
        amount === 0 && muted && "text-muted-foreground/50",
        amount === 0 && !muted && "text-muted-foreground/50",
        className,
      )}
    >
      {amount > 0 ? formatCurrency(amount) : "—"}
    </td>
  );
}

type Tone = "ok" | "watch" | "warn" | "bad" | "muted";

const TONE_CLASSES: Record<Tone, string> = {
  ok: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
  watch: "border-yellow-500/30  bg-yellow-500/5  text-yellow-700  dark:text-yellow-300",
  warn: "border-orange-500/30  bg-orange-500/5  text-orange-700  dark:text-orange-300",
  bad: "border-red-500/30     bg-red-500/5     text-red-700     dark:text-red-300",
  muted: "border-border         bg-card",
};

function SummaryTile({
  label,
  value,
  tone,
  emphasis,
}: {
  label: string;
  value: number;
  tone: Tone;
  emphasis?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border p-4 shadow-sm", TONE_CLASSES[tone])}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className={cn("mt-1 font-bold tabular-nums", emphasis ? "text-2xl" : "text-xl")}>
        {formatCurrency(value)}
      </div>
    </div>
  );
}
