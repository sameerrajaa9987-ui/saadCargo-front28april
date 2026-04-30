import { useProfitLoss } from "@/modules/accounts/hooks/useLedger";
import type { PnlData } from "@/modules/accounts/types";
import { formatPKR } from "@/shared/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MinusCircle,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ProfitLossPage() {
  const { data: apiData, isLoading } = useProfitLoss();

  const pnlData: PnlData | null = apiData || null;

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  if (!pnlData) return <p>Failed to load</p>;

  const items = [
    {
      label: "Total Revenue",
      value: pnlData.revenue,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Cost of Goods",
      value: pnlData.cost,
      icon: MinusCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      label: "Gross Profit",
      value: pnlData.grossProfit,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Operating Expenses",
      value: pnlData.expenses,
      icon: TrendingDown,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "Net Profit",
      value: pnlData.netProfit,
      icon: BarChart3,
      color: pnlData.netProfit >= 0 ? "text-emerald-600" : "text-red-600",
      bg:
        pnlData.netProfit >= 0
          ? "bg-emerald-100 dark:bg-emerald-900/30"
          : "bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profit & Loss Statement</h1>
        <p className="text-sm text-muted-foreground">
          Automatically calculated from all bookings and payments
        </p>
      </div>
      <div className="mx-auto max-w-2xl space-y-3">
        {items.map((item, i) => (
          <Card
            key={i}
            className={i === items.length - 1 ? "ring-2 ring-primary/30" : ""}
          >
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span
                  className={`text-sm font-medium ${i === items.length - 1 ? "text-lg font-bold" : ""}`}
                >
                  {item.label}
                </span>
              </div>
              <span className={`text-lg font-bold ${item.color}`}>
                {formatPKR(item.value)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
