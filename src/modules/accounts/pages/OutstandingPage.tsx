import { useOutstanding } from "@/modules/accounts/hooks/useLedger";
import { formatINR } from "@/shared/lib/utils";
import { AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  outstandingBalance: number;
};

export function OutstandingPage() {
  const { data, isLoading } = useOutstanding();

  const clients: Client[] = data
    ? data.map((row) => ({
        id: row.clientId,
        name: row.clientName,
        phone: "",
        email: "",
        outstandingBalance: row.totalOutstanding,
      }))
    : [];

  const total = clients.reduce((s, c) => s + c.outstandingBalance, 0);

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Outstanding Balances</h1>
        <p className="text-sm text-muted-foreground">Clients who owe money</p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              Total Outstanding: {formatINR(total)}
            </p>
            <p className="text-sm text-amber-600">
              {clients.length} clients with pending balances
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="text-right font-semibold">
                Outstanding
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-muted-foreground"
                >
                  No outstanding balances 🎉
                </TableCell>
              </TableRow>
            ) : (
              clients.map((c) => (
                <TableRow key={c.id} className="hover:bg-accent/30">
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone || "—"}</TableCell>
                  <TableCell>{c.email || "—"}</TableCell>
                  <TableCell className="text-right font-bold text-amber-600">
                    {formatINR(c.outstandingBalance)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
