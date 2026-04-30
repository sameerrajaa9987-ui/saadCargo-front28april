export function formatPKR(n: number | undefined | null): string {
  if (n == null) return "₨ 0";
  return "₨ " + n.toLocaleString("en-PK");
}

export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: string | Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    in_transit:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    arrived:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    delivered:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    partial:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    warehouse:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    received:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    expense: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    inactive:
      "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  };
  return (
    map[status] ||
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
  );
}
