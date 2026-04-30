import { ResourceListPage } from "@/modules/common/shared-crud/ResourceListPage";
import {
  useClients,
  useDeleteClient,
} from "@/modules/settings/hooks/useClients";
import { ClientDialog } from "@/modules/settings/components/ClientDialog";
import type { ClientRow } from "@/modules/settings/types";
import { formatPKR, formatDate } from "@/shared/lib/utils";

type ClientQuery = {
  search?: string;
  page: number;
  limit: number;
  sortBy: "createdAt";
  sortDir: "desc";
};

export function ClientsPage() {
  return (
    <ResourceListPage<ClientRow, ClientQuery>
      title="Manage Clients"
      subtitle="Customer database"
      newButtonText="Add Client"
      minTableWidth="min-w-[800px]"
      emptyText="No clients found"
      deleteConfirmText="Delete this client?"
      defaultSortBy="createdAt"
      hideIdColumn
      buildQuery={({ search, page, limit }) => ({
        search: search.trim() || undefined,
        page,
        limit,
        sortBy: "createdAt",
        sortDir: "desc",
      })}
      columns={[
        {
          header: "Name",
          getValue: (item) => item.name,
          valueClassName: "font-medium",
        },
        {
          header: "Phone",
          getValue: (item) => item.phone || "—",
        },
        {
          header: "Email",
          getValue: (item) => item.email || "—",
        },
        {
          header: "Outstanding",
          getValue: (item) =>
            item.outstandingBalance > 0
              ? formatPKR(item.outstandingBalance)
              : "—",
          valueClassName: "text-right font-semibold text-amber-600",
        },
        {
          header: "Created",
          getValue: (item) => formatDate(item.createdAt),
        },
      ]}
      getIdValue={(item) => item.id}
      useList={
        useClients as (query: ClientQuery) => {
          data?: {
            items: ClientRow[];
            meta: {
              total: number;
              totalPages: number;
              hasNextPage: boolean;
              hasPrevPage: boolean;
            };
          };
          isLoading: boolean;
          error: unknown;
          refetch: () => Promise<unknown>;
        }
      }
      useDelete={useDeleteClient}
      renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
        <ClientDialog
          open={open}
          onOpenChange={onOpenChange}
          mode={mode}
          value={value}
          onSuccess={onSuccess}
        />
      )}
    />
  );
}
