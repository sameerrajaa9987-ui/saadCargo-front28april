import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { http } from "@/shared/api/http";
import {
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  Truck,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatPKR } from "@/shared/lib/utils";

type AdminData = {
  bookingsThisMonth: number;
  revenueThisMonth: number;
  profitThisMonth: number;
  pendingPayments: number;
  activeShipments: number;
  delayedShipments: number;
  inventory: Record<string, number>;
  recentBookings: {
    id: string;
    bookingId: string;
    clientName: string;
    status: string;
    sellingPrice: number;
    createdAt: string;
  }[];
  monthlyRevenue: { month: string; revenue: number; profit: number }[];
};

type OperatorData = {
  todaysBookings: number;
  activeShipments: number;
  pendingWagons: number;
};
type AccountantData = {
  todayDebits: number;
  todayCredits: number;
  outstandingReceivables: number;
  revenue: number;
  cost: number;
  profit: number;
};

function StatCard({
  icon: Icon,
  label,
  value,
  color = "orange",
  prefix = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color?: string;
  prefix?: string;
}) {
  const colorMap: Record<string, { from: string; to: string }> = {
    orange: { from: "from-orange-500", to: "to-amber-600" },
    green: { from: "from-emerald-500", to: "to-emerald-600" },
    yellow: { from: "from-amber-500", to: "to-yellow-500" },
    red: { from: "from-red-500", to: "to-red-600" },
    purple: { from: "from-purple-500", to: "to-purple-600" },
    indigo: { from: "from-indigo-500", to: "to-indigo-600" },
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
          <div
            className={`ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[color].from} ${colorMap[color].to} text-white shadow-lg`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [operatorData, setOperatorData] = useState<OperatorData | null>(null);
  const [accountantData, setAccountantData] = useState<AccountantData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        if (user?.role === "admin") {
          const res = await http.get("/ledger/dashboard/admin");
          setAdminData(res.data.data);
        } else if (user?.role === "operator") {
          const res = await http.get("/ledger/dashboard/operator");
          setOperatorData(res.data.data);
        } else if (user?.role === "accountant") {
          const res = await http.get("/ledger/dashboard/accountant");
          setAccountantData(res.data.data);
        }
      } catch {
        // silently fail on dashboard, show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [user?.role]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  // Admin dashboard
  if (user?.role === "admin" && adminData) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of Saad Cargo operations this month
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Package}
            label="Bookings"
            value={adminData.bookingsThisMonth}
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            label="Revenue"
            value={formatPKR(adminData.revenueThisMonth)}
            color="green"
          />
          <StatCard
            icon={DollarSign}
            label="Net Profit"
            value={formatPKR(adminData.profitThisMonth)}
            color="purple"
          />
          <StatCard
            icon={Clock}
            label="Pending Payments"
            value={adminData.pendingPayments}
            color="yellow"
          />
          <StatCard
            icon={Truck}
            label="Active Shipments"
            value={adminData.activeShipments}
            color="indigo"
          />
          <StatCard
            icon={AlertTriangle}
            label="Delayed"
            value={adminData.delayedShipments}
            color={adminData.delayedShipments > 0 ? "red" : "green"}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Revenue (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={adminData.monthlyRevenue}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Revenue (₨)"
                  />
                  <Bar
                    dataKey="profit"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Profit (₨)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
              <button
                onClick={() => window.location.assign("/bookings")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {adminData.recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-accent/50 px-4 py-3 transition-colors hover:bg-accent/70"
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {b.bookingId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {b.clientName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">
                        {formatPKR(b.sellingPrice)}
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                ))}
                {adminData.recentBookings.length === 0 && (
                  <p className="py-12 text-center text-sm text-muted-foreground">
                    No bookings yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Operator dashboard
  if (user?.role === "operator" && operatorData) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Operator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Your daily operations overview
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <StatCard
            icon={Package}
            label="Today's Bookings"
            value={operatorData.todaysBookings}
            color="orange"
          />
          <StatCard
            icon={Truck}
            label="Active Shipments"
            value={operatorData.activeShipments}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Pending Wagons"
            value={operatorData.pendingWagons}
            color="yellow"
          />
        </div>
      </div>
    );
  }

  // Accountant dashboard
  if (user?.role === "accountant" && accountantData) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Accountant Dashboard
          </h1>
          <p className="text-muted-foreground">
            Financial overview
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={TrendingUp}
            label="Today's Debits"
            value={formatPKR(accountantData.todayDebits)}
            color="red"
          />
          <StatCard
            icon={DollarSign}
            label="Today's Credits"
            value={formatPKR(accountantData.todayCredits)}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Outstanding Receivables"
            value={formatPKR(accountantData.outstandingReceivables)}
            color="yellow"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={formatPKR(accountantData.revenue)}
            color="orange"
          />
          <StatCard
            icon={DollarSign}
            label="Total Cost"
            value={formatPKR(accountantData.cost)}
            color="purple"
          />
          <StatCard
            icon={BarChart3}
            label="Net Profit"
            value={formatPKR(accountantData.profit)}
            color="indigo"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-muted-foreground">Welcome to Saad Cargo Services</p>
    </div>
  );
}
