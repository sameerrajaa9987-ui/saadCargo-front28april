import { http } from "@/shared/api/http";

export type DailyReportRow = {
  date: string;
  consignmentCount: number;
  totalPackages: number;
  totalChargeableWeight: number;
  totalFreight: number;
  totalReimbursement: number;
  totalHamali: number;
  totalOther: number;
  totalAmount: number;
};

export type OutstandingRow = {
  partyId: string;
  partyName: string;
  partyCity: string;
  mobile: string;
  consignmentCount: number;
  totalAmount: number;
  totalFreight: number;
  totalReimbursement: number;
  aged0to30: number;
  aged31to60: number;
  aged61to90: number;
  aged90Plus: number;
};

export type OutstandingMeta = {
  grandTotal: number;
  aged0to30: number;
  aged31to60: number;
  aged61to90: number;
  aged90Plus: number;
};

export type StationRow = {
  station: string;
  consignmentCount: number;
  totalPackages: number;
  totalChargeableWeight: number;
  totalFreight: number;
  totalAmount: number;
};

export type GstRow = {
  billNumber: string;
  date: string;
  partyName: string;
  gstin: string;
  status: string;
  reimbursementSubtotal: number;
  serviceSubtotal: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  grossTotal: number;
};

export type GstSummary = {
  totalServiceSubtotal: number;
  totalReimbursement: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  grandTotal: number;
};

export async function getDailyReport(params: { startDate: string; endDate: string }) {
  const res = await http.get<{ data: DailyReportRow[] }>("/reports/daily", { params });
  return res.data.data;
}

export async function getOutstandingReport() {
  const res = await http.get<{ data: OutstandingRow[]; meta: OutstandingMeta }>(
    "/reports/outstanding",
  );
  return { rows: res.data.data, meta: res.data.meta };
}

export async function getStationReport(params: { startDate: string; endDate: string }) {
  const res = await http.get<{ data: StationRow[] }>("/reports/station", { params });
  return res.data.data;
}

export async function getGstReport(params: { month: number; year: number }) {
  const res = await http.get<{ data: GstRow[]; meta: GstSummary }>("/reports/gst", { params });
  return { rows: res.data.data, summary: res.data.meta };
}

export function getExportUrl(
  type: "daily" | "outstanding" | "station" | "gst",
  params: Record<string, string | number>,
) {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  ).toString();
  return `${base}/reports/${type}/export?${qs}`;
}
