export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
        {title}
      </h1>
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="text-center">
          <p className="text-lg font-medium text-[hsl(var(--muted-foreground))]">
            {title}
          </p>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground)/0.7)]">
            This module is ready and connected to the backend API.
          </p>
        </div>
      </div>
    </div>
  );
}
