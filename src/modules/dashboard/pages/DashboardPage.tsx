import {
  Package,
  IndianRupee,
  AlertTriangle,
  FileText,
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useDashboard } from "../hooks/useDashboard";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PAYMENT_MODE_COLORS,
  PAYMENT_STATUS_COLORS,
} from "@/modules/consignment/constants/consignment.constants";
import type { PaymentModeMix } from "../api/dashboardApi";

/** On-brand palette pulled from index.css. Recharts wants string colors. */
const SAFFRON = "#FF7733";
const SAFFRON_SOFT = "#FFA876";
const NAVY = "#1F3050";
const SLATE = "#94A3B8";

/** Maps each payment mode to a distinguishable colour for the donut. */
const MODE_COLOURS: Record<PaymentModeMix["mode"], string> = {
  paid_source: "#10B981", // emerald
  to_pay:      "#F59E0B", // amber
  on_bill:     "#3B82F6", // blue
  slip:        "#94A3B8", // slate
};

const MODE_LABELS: Record<PaymentModeMix["mode"], string> = {
  paid_source: "Paid Source",
  to_pay:      "To Pay",
  on_bill:     "On Bill",
  slip:        "Slip",
};

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}

/** Compact ₹ tooltip — Recharts otherwise dumps a verbose payload */
function MoneyTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      {label && <div className="font-semibold text-foreground mb-1">{label}</div>}
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">
            {p.dataKey === "consignments" || p.dataKey === "count"
              ? p.value
              : formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load dashboard: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  const trend = data?.monthlyTrend ?? [];
  const mix = (data?.paymentModeMix ?? []).filter((m) => m.count > 0);
  const stations = data?.topStations ?? [];
  const totalConsignmentsThisMonth = mix.reduce((s, m) => s + m.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Today's overview ·{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          icon={Package}
          label="Today's Consignments"
          value={data?.today.consignmentCount ?? 0}
          sub={`${data?.today.totalPackages ?? 0} packages`}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <MetricCard
          icon={IndianRupee}
          label="Today's Revenue"
          value={formatCurrency(data?.today.totalRevenue ?? 0)}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Outstanding"
          value={formatCurrency(data?.outstanding.totalAmount ?? 0)}
          sub={`${data?.outstanding.consignmentCount ?? 0} pending`}
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Pending PODs"
          value={data?.pendingPods ?? 0}
          sub="not yet delivered"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <MetricCard
          icon={FileText}
          label="Active Invoices"
          value={data?.activeInvoices ?? 0}
          sub="draft + sent"
          color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 6-month revenue trend */}
        <div className="lg:col-span-2">
          <ChartCard title="Revenue — Last 6 Months" subtitle="Total consignment value per month">
            {trend.every((t) => t.revenue === 0) ? (
              <EmptyChart label="No revenue in the last 6 months yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={SAFFRON} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={SAFFRON_SOFT} stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
                  />
                  <Tooltip cursor={{ fill: "hsl(var(--accent) / 0.10)" }} content={<MoneyTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Payment mode pie */}
        <ChartCard
          title="Payment Mix — This Month"
          subtitle={
            totalConsignmentsThisMonth > 0
              ? `${totalConsignmentsThisMonth} consignments`
              : "No consignments yet this month"
          }
        >
          {mix.length === 0 ? (
            <EmptyChart label="Add consignments to see the mix" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mix}
                  dataKey="count"
                  nameKey="mode"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                >
                  {mix.map((m) => (
                    <Cell key={m.mode} fill={MODE_COLOURS[m.mode]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const datum = payload[0].payload as PaymentModeMix;
                    return (
                      <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
                        <div className="font-semibold text-foreground mb-1">
                          {MODE_LABELS[datum.mode]}
                        </div>
                        <div className="text-muted-foreground">
                          {datum.count} consignments
                        </div>
                        <div className="text-foreground font-medium">
                          {formatCurrency(datum.amount)}
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  formatter={(v) => MODE_LABELS[v as PaymentModeMix["mode"]] ?? v}
                  wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Top stations */}
      <ChartCard title="Top Destination Stations — This Month" subtitle="By revenue">
        {stations.length === 0 ? (
          <EmptyChart label="No consignments yet this month" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stations}
              layout="vertical"
              margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
              />
              <YAxis
                dataKey="station"
                type="category"
                width={70}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontFamily: "ui-monospace, monospace" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent) / 0.10)" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const datum = payload[0].payload as (typeof stations)[number];
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
                      <div className="font-semibold text-foreground mb-1 font-mono">{label}</div>
                      <div className="text-muted-foreground">
                        {datum.consignments} consignments · {datum.packages} packages
                      </div>
                      <div className="text-foreground font-medium">
                        {formatCurrency(datum.revenue)}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="revenue" name="Revenue" fill={NAVY} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Recent consignments */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Recent Consignments</h2>
          <p className="text-xs text-muted-foreground">Last 10 entries</p>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                {["Date", "Party", "Destination", "Pkgs", "Mode", "Status", "Total (₹)"].map((h) => (
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
              {data?.recentConsignments?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No consignments yet today
                  </td>
                </tr>
              )}
              {data?.recentConsignments?.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5">{formatDate(c.date)}</td>
                  <td className="px-4 py-2.5 font-medium">{c.party?.name ?? "-"}</td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-primary">
                    {c.destinationStation}
                  </td>
                  <td className="px-4 py-2.5">{c.packages}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        PAYMENT_MODE_COLORS[c.paymentMode] ?? ""
                      }`}
                    >
                      {c.paymentMode.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        PAYMENT_STATUS_COLORS[c.paymentStatus] ?? ""
                      }`}
                    >
                      {c.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold">{formatCurrency(c.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subtle "Recharts notice" — silenced by suppressing _SLATE_, kept usage for future scenarios */}
      <span className="hidden" data-slate-token={SLATE} />
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
