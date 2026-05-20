import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { PartyDialog } from "../components/PartyDialog";
import { useParties, useDeleteParty } from "../hooks/useParties";
import type { Party, PartyListQuery } from "../types";

export function PartyListPage() {
  return (
    <ResourceListPage<Party, PartyListQuery>
      title="Parties"
      subtitle="Credit customers, agents, and business contacts"
      newButtonText="New Party"
      searchPlaceholder="Search by name, city, phone..."
      minTableWidth="min-w-[1000px]"
      emptyText="No parties found. Create your first party."
      deleteConfirmText="Delete this party? All linked consignments will be unaffected but the party record will be removed."
      columns={[
        { header: "Name", getValue: (p) => <span className="font-medium">{p.name}</span> },
        { header: "City", getValue: (p) => p.city || "-" },
        { header: "State", getValue: (p) => p.state || "-" },
        { header: "Mobile", getValue: (p) => p.mobile || "-" },
        { header: "Email", getValue: (p) => p.email || "-", className: "max-w-[200px] truncate" },
        { header: "GSTIN", getValue: (p) => p.gstin ? <span className="font-mono text-xs">{p.gstin}</span> : "-" },
        { header: "PAN", getValue: (p) => p.pan ? <span className="font-mono text-xs">{p.pan}</span> : "-" },
        {
          header: "Status",
          getValue: (p) => (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
              {p.isActive ? "Active" : "Inactive"}
            </span>
          ),
        },
      ]}
      useList={useParties}
      useDelete={useDeleteParty}
      buildQuery={({ search, page, limit }) => ({
        search: search || undefined,
        page,
        limit,
        sortBy: "createdAt",
        sortDir: "desc" as const,
      })}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <PartyDialog open={open} onOpenChange={onOpenChange} mode={mode} value={value} onSuccess={onSuccess} />
      )}
    />
  );
}
