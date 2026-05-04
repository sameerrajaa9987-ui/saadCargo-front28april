import { useBalanceSheet } from "@/modules/accounts/hooks/useLedger";
import { formatINR } from "@/shared/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { BalanceSheetData } from "@/modules/accounts/types";

export function BalanceSheetPage() {
  const { data: apiData, isLoading } = useBalanceSheet();

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  if (!apiData) return <p>Failed to load</p>;

  const data: BalanceSheetData = apiData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Balance Sheet</h1>
        <p className="text-sm text-muted-foreground">
          Current financial position of the company
        </p>
      </div>
      <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-2">
        {/* Assets */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-emerald-600">
              Assets
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Cash & Bank</span>
                <span className="font-medium">
                  {formatINR(data.assets.cash)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Accounts Receivable</span>
                <span className="font-medium">
                  {formatINR(data.assets.accountsReceivable)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inventory (items)</span>
                <span className="font-medium">
                  {formatINR(data.assets.inventoryValue)}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-sm font-bold">
                <span>Total Assets</span>
                <span className="text-emerald-600">
                  {formatINR(data.assets.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Liabilities */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-red-600">
              Liabilities
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Accounts Payable (Railway)</span>
                <span className="font-medium">
                  {formatINR(data.liabilities.accountsPayable)}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-sm font-bold">
                <span>Total Liabilities</span>
                <span className="text-red-600">
                  {formatINR(data.liabilities.total)}
                </span>
              </div>
            </div>
            <div className="mt-6 rounded-lg bg-accent p-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Net Worth</span>
                <span
                  className={
                    data.netWorth >= 0 ? "text-emerald-600" : "text-red-600"
                  }
                >
                  {formatINR(data.netWorth)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
