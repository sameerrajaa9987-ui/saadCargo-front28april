import { http } from "@/shared/api/http";

export type MonthlyTrendPoint = {
  month: string;       // "2026-05"
  label: string;       // "May 26"
  revenue: number;
  consignments: number;
};

export type PaymentModeMix = {
  mode: "paid_source" | "to_pay" | "on_bill" | "slip";
  count: number;
  amount: number;
};

export type TopStation = {
  station: string;
  revenue: number;
  consignments: number;
  packages: number;
};

export type DashboardMetrics = {
  today: { consignmentCount: number; totalRevenue: number; totalPackages: number };
  outstanding: { totalAmount: number; consignmentCount: number };
  pendingPods: number;
  activeInvoices: number;
  recentConsignments: Array<{
    id: string;
    date: string;
    party: { id: string; name: string; city?: string } | null;
    destinationStation: string;
    packages: number;
    totalAmount: number;
    paymentMode: string;
    paymentStatus: string;
  }>;
  monthlyTrend: MonthlyTrendPoint[];
  paymentModeMix: PaymentModeMix[];
  topStations: TopStation[];
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const res = await http.get<{ data: DashboardMetrics }>("/dashboard");
  return res.data.data;
}
