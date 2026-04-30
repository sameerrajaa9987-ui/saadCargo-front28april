import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  total: number;
};

export function Pagination({ page, totalPages, onPageChange, total }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-[hsl(var(--border))] px-1 pt-4">
      <span className="text-sm text-[hsl(var(--muted-foreground))]">
        {total} total records
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-[hsl(var(--border))] p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[80px] text-center text-sm text-[hsl(var(--foreground))]">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-[hsl(var(--border))] p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))] disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
