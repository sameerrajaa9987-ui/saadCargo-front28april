import { http, getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";

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

/**
 * Download an Excel export through the authenticated axios client so the bearer
 * token is attached. A plain `<a href>` cannot send the token — the server then
 * rejects it with "No token provided" (401). We fetch the file as a blob and
 * trigger a download from it.
 */
export async function downloadReportExport(
  type: "daily" | "outstanding" | "station" | "gst",
  params: Record<string, string | number>,
  filename: string,
): Promise<void> {
  try {
    const res = await http.get(`/reports/${type}/export`, {
      params,
      responseType: "blob",
    });
    const blob = new Blob([res.data], {
      type:
        (res.headers?.["content-type"] as string | undefined) ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (err) {
    toast.error(getApiErrorMessage(err));
  }
}
