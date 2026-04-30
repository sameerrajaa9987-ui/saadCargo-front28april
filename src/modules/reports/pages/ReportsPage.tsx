import { useState } from "react";
import { ledgerApi } from "@/modules/accounts/api/ledgerApi";
import { bookingApi } from "@/modules/booking/api/bookingApi";
import { paymentApi } from "@/modules/payment/api/paymentApi";
import { inventoryApi } from "@/modules/inventory/api/inventoryApi";
import { formatPKR, formatDate } from "@/shared/lib/utils";
import { toast } from "@/shared/lib/toast";
import {
  Printer,
  FileText,
  BarChart3,
  Wallet,
  Package,
  Warehouse,
  CreditCard,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/hooks";
import type { BookingRow } from "@/modules/booking/types";
import type { PaymentRow } from "@/modules/payment/types";
import type { InventoryRow } from "@/modules/inventory/types";
import type {
  LedgerRow,
  PnlData,
  OutstandingRow,
} from "@/modules/accounts/types";

type ReportType =
  | "ledger"
  | "profit-loss"
  | "balance-sheet"
  | "outstanding"
  | "shipment"
  | "inventory"
  | "payment";

export function ReportsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const isOperator = user?.role === "operator";
  const [activeReport, setActiveReport] = useState<ReportType>("ledger");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<unknown>(null);

  const reports = [
    {
      id: "ledger" as ReportType,
      name: "Ledger Report",
      icon: FileText,
      description: "Full transaction history",
    },
    {
      id: "profit-loss" as ReportType,
      name: "Profit & Loss",
      icon: BarChart3,
      description: "Revenue, costs, and profit",
    },
    {
      id: "balance-sheet" as ReportType,
      name: "Balance Sheet",
      icon: Wallet,
      description: "Assets, liabilities, net worth",
    },
    {
      id: "outstanding" as ReportType,
      name: "Client Outstanding",
      icon: CreditCard,
      description: "Clients who owe money",
    },
    {
      id: "shipment" as ReportType,
      name: "Shipment Status",
      icon: Package,
      description: "Bookings and status",
    },
    {
      id: "inventory" as ReportType,
      name: "Inventory",
      icon: Warehouse,
      description: "Goods tracking",
    },
    {
      id: "payment" as ReportType,
      name: "Payment History",
      icon: DollarSign,
      description: "Incoming/outgoing payments",
    },
  ];
  const visibleReports = isOperator
    ? reports.filter((r) => ["shipment", "inventory", "payment"].includes(r.id))
    : reports;
  const currentReport =
    visibleReports.find((r) => r.id === activeReport)?.id ??
    visibleReports[0]?.id ??
    "shipment";

  async function generateReport() {
    setLoading(true);
    try {
      let data: unknown;
      switch (currentReport) {
        case "ledger": {
          const ledgerRes = await ledgerApi.list({
            limit: 1000,
            dateFrom,
            dateTo,
          });
          data = ledgerRes.items;
          break;
        }
        case "profit-loss":
          data = await ledgerApi.profitLoss();
          break;
        case "balance-sheet":
          data = await ledgerApi.balanceSheet();
          break;
        case "outstanding":
          data = await ledgerApi.outstanding();
          break;
        case "shipment": {
          const bookingRes = await bookingApi.list({ limit: 1000 });
          data = bookingRes.items;
          break;
        }
        case "inventory": {
          const inventoryRes = await inventoryApi.list({ limit: 1000 });
          data = inventoryRes.items;
          break;
        }
        case "payment": {
          const paymentRes = await paymentApi.list({
            limit: 1000,
            dateFrom,
            dateTo,
          });
          data = paymentRes.items;
          break;
        }
      }
      setReportData(data);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate and export business reports
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="no-print w-64 space-y-2">
          {visibleReports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                activeReport === report.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <report.icon className="h-4 w-4" />
              {report.name}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="flex-1 space-y-4">
          <div className="no-print flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Date Range:</span>
            </div>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[150px]"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[150px]"
            />
            <Button onClick={generateReport} disabled={loading}>
              Generate Report
            </Button>
            {!!reportData && (
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print / Save PDF
              </Button>
            )}
          </div>

          <div className="print-only-content">
            {loading && (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              </div>
            )}

            {!loading && !reportData && (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                Select a report type and click Generate Report
              </div>
            )}

            {!loading && !!reportData && (
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-6 py-4">
                  <h2 className="text-lg font-semibold">
                    {visibleReports.find((r) => r.id === currentReport)?.name}
                  </h2>
                </div>
                <div className="p-6">
                  {currentReport === "ledger" && (
                    <LedgerReportContent data={reportData as LedgerRow[]} />
                  )}
                  {currentReport === "profit-loss" && (
                    <ProfitLossReportContent data={reportData as PnlData} />
                  )}
                  {currentReport === "balance-sheet" && (
                    <BalanceSheetReportContent
                      data={reportData as BalanceSheetData}
                    />
                  )}
                  {currentReport === "outstanding" && (
                    <OutstandingReportContent
                      data={reportData as OutstandingRow[]}
                    />
                  )}
                  {currentReport === "shipment" && (
                    <ShipmentReportContent data={reportData as BookingRow[]} />
                  )}
                  {currentReport === "inventory" && (
                    <InventoryReportContent
                      data={reportData as InventoryRow[]}
                    />
                  )}
                  {currentReport === "payment" && (
                    <PaymentReportContent data={reportData as PaymentRow[]} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LedgerReportContent({ data }: { data: LedgerRow[] }) {
  const totalDebit = data.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = data.reduce((sum, r) => sum + r.credit, 0);

  return (
    <div className="space-y-4">
      <table className="w-full text-sm">
        <thead className="bg-muted/35">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-left font-medium">Description</th>
            <th className="px-4 py-2 text-left font-medium">Account</th>
            <th className="px-4 py-2 text-right font-medium">Debit (₨)</th>
            <th className="px-4 py-2 text-right font-medium">Credit (₨)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-border">
              <td className="px-4 py-2">{formatDate(row.date)}</td>
              <td className="px-4 py-2">{row.description}</td>
              <td className="px-4 py-2">{row.accountType}</td>
              <td className="px-4 py-2 text-right">
                {row.debit > 0 ? formatPKR(row.debit) : "—"}
              </td>
              <td className="px-4 py-2 text-right">
                {row.credit > 0 ? formatPKR(row.credit) : "—"}
              </td>
            </tr>
          ))}
          <tr className="bg-muted/35 font-semibold">
            <td className="px-4 py-2" colSpan={3}>
              Totals
            </td>
            <td className="px-4 py-2 text-right">{formatPKR(totalDebit)}</td>
            <td className="px-4 py-2 text-right">{formatPKR(totalCredit)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ProfitLossReportContent({ data }: { data: PnlData }) {
  const totalRevenue = data.revenue;
  const netProfit = data.netProfit;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Revenue</h3>
        <div className="rounded-lg bg-accent p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">{formatPKR(totalRevenue)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Costs</h3>
        <div className="flex justify-between rounded-lg bg-accent px-4 py-3">
          <span className="text-sm">Direct Cost</span>
          <span className="font-medium">{formatPKR(data.cost)}</span>
        </div>
        <div className="flex justify-between rounded-lg bg-accent px-4 py-3">
          <span className="text-sm">Operating Expenses</span>
          <span className="font-medium">{formatPKR(data.expenses)}</span>
        </div>
      </div>

      <div className="rounded-lg border-2 border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">NET PROFIT</p>
        <p
          className={`text-3xl font-bold ${netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
        >
          {formatPKR(netProfit)}
        </p>
      </div>
    </div>
  );
}

function BalanceSheetReportContent({ data }: { data: BalanceSheetData }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b border-border pb-2">
          Assets
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Cash</span>
            <span className="font-medium">{formatPKR(data.assets.cash)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Accounts Receivable
            </span>
            <span className="font-medium">
              {formatPKR(data.assets.accountsReceivable)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Inventory Value
            </span>
            <span className="font-medium">
              {formatPKR(data.assets.inventoryValue)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>Total Assets</span>
            <span>{formatPKR(data.assets.total)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b border-border pb-2">
          Liabilities
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Accounts Payable
            </span>
            <span className="font-medium">
              {formatPKR(data.liabilities.accountsPayable)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>Total Liabilities</span>
            <span>{formatPKR(data.liabilities.total)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-primary/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">NET WORTH</p>
          <p className="text-2xl font-bold text-primary">
            {formatPKR(data.netWorth)}
          </p>
        </div>
      </div>
    </div>
  );
}

function OutstandingReportContent({ data }: { data: OutstandingRow[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/35">
        <tr>
          <th className="px-4 py-2 text-left font-medium">Client Name</th>
          <th className="px-4 py-2 text-left font-medium">
            Total Outstanding (₨)
          </th>
          <th className="px-4 py-2 text-left font-medium">Last Payment</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row.clientId}
            className={`border-b border-border ${row.totalOutstanding > 0 ? "bg-red-50 dark:bg-red-900/10" : "bg-emerald-50 dark:bg-emerald-900/10"}`}
          >
            <td className="px-4 py-2">{row.clientName}</td>
            <td
              className={`px-4 py-2 font-semibold ${row.totalOutstanding > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}
            >
              {formatPKR(row.totalOutstanding)}
            </td>
            <td className="px-4 py-2">
              {row.lastPaymentDate ? formatDate(row.lastPaymentDate) : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ShipmentReportContent({ data }: { data: BookingRow[] }) {
  const statusCounts = data.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="rounded-lg bg-accent p-4 text-center">
            <p className="text-sm text-muted-foreground">{status}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead className="bg-muted/35">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Booking ID</th>
            <th className="px-4 py-2 text-left font-medium">Client</th>
            <th className="px-4 py-2 text-left font-medium">Route</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">
              Selling Price (₨)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-border">
              <td className="px-4 py-2 font-mono">{row.bookingId}</td>
              <td className="px-4 py-2">{row.client?.label || "—"}</td>
              <td className="px-4 py-2">
                {row.sourceStation} → {row.destinationStation}
              </td>
              <td className="px-4 py-2">{row.status}</td>
              <td className="px-4 py-2 text-right">
                {formatPKR(row.sellingPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InventoryReportContent({ data }: { data: InventoryRow[] }) {
  const statusCounts = data.reduce(
    (acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-accent p-4 text-center">
          <p className="text-sm text-muted-foreground">In Warehouse</p>
          <p className="text-2xl font-bold">{statusCounts["warehouse"] || 0}</p>
        </div>
        <div className="rounded-lg bg-accent p-4 text-center">
          <p className="text-sm text-muted-foreground">In Transit</p>
          <p className="text-2xl font-bold">
            {statusCounts["in_transit"] || 0}
          </p>
        </div>
        <div className="rounded-lg bg-accent p-4 text-center">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold">{statusCounts["delivered"] || 0}</p>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-muted/35">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Item</th>
            <th className="px-4 py-2 text-left font-medium">Booking</th>
            <th className="px-4 py-2 text-left font-medium">Qty</th>
            <th className="px-4 py-2 text-left font-medium">Unit</th>
            <th className="px-4 py-2 text-left font-medium">Location</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-border">
              <td className="px-4 py-2">{row.itemName}</td>
              <td className="px-4 py-2">{row.booking?.label || "—"}</td>
              <td className="px-4 py-2">{row.quantity}</td>
              <td className="px-4 py-2">{row.unit}</td>
              <td className="px-4 py-2">{row.location || "—"}</td>
              <td className="px-4 py-2">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentReportContent({ data }: { data: PaymentRow[] }) {
  const totalReceived = data
    .filter((p) => p.type === "received")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = data
    .filter((p) => p.type === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = data
    .filter((p) => p.type === "expense")
    .reduce((sum, p) => sum + p.amount, 0);
  const netCash = totalReceived - totalPaid - totalExpense;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Received</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatPKR(totalReceived)}
          </p>
        </div>
        <div className="rounded-lg bg-red-500/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatPKR(totalPaid)}
          </p>
        </div>
        <div className="rounded-lg bg-orange-500/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatPKR(totalExpense)}
          </p>
        </div>
        <div className="rounded-lg bg-blue-500/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">Net Cash</p>
          <p
            className={`text-2xl font-bold ${netCash >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
          >
            {formatPKR(netCash)}
          </p>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-muted/35">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-left font-medium">Type</th>
            <th className="px-4 py-2 text-left font-medium">Client/Vendor</th>
            <th className="px-4 py-2 text-right font-medium">Amount (₨)</th>
            <th className="px-4 py-2 text-left font-medium">Mode</th>
            <th className="px-4 py-2 text-left font-medium">Reference</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-border">
              <td className="px-4 py-2">{formatDate(row.date)}</td>
              <td className="px-4 py-2">{row.type}</td>
              <td className="px-4 py-2">{row.clientOrVendorName}</td>
              <td
                className={`px-4 py-2 text-right font-medium ${row.type === "received" ? "text-emerald-600 dark:text-emerald-400" : row.type === "expense" ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"}`}
              >
                {formatPKR(row.amount)}
              </td>
              <td className="px-4 py-2">{row.mode}</td>
              <td className="px-4 py-2">{row.referenceNumber || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type BalanceSheetData = {
  assets: {
    cash: number;
    accountsReceivable: number;
    inventoryValue: number;
    total: number;
  };
  liabilities: {
    accountsPayable: number;
    total: number;
  };
  netWorth: number;
};

// Add print-specific CSS
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @media print {
      .no-print {
        display: none !important;
      }
      .print-only-content {
        display: block !important;
      }
      body {
        background: white !important;
      }
      .rounded-xl, .rounded-lg, .border {
        border: 1px solid #000 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      table {
        width: 100% !important;
        border-collapse: collapse !important;
      }
      th, td {
        border: 1px solid #000 !important;
        padding: 4px 8px !important;
      }
      th {
        background: #f0f0f0 !important;
      }
      .bg-muted\\/35, .bg-accent {
        background: #f0f0f0 !important;
      }
      .text-primary, .text-emerald-600, .text-red-600, .text-orange-600, .text-blue-600 {
        color: #000 !important;
      }
    }
  `;
  document.head.appendChild(style);
}
