import { useState } from "react";
import { ResourceListPage } from "@/modules/common/shared-crud/ResourceListPage";
import {
  useUsers,
  useDeleteUser,
  useResetPassword,
} from "@/modules/settings/hooks/useUsers";
import { UserDialog } from "@/modules/settings/components/UserDialog";
import type { UserRow } from "@/modules/settings/types";
import { formatDate } from "@/shared/lib/utils";
import { toast } from "@/shared/lib/toast";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UserQuery = {
  search?: string;
  page: number;
  limit: number;
  sortBy: "createdAt";
  sortDir: "desc";
};

export function UsersPage() {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const resetMutation = useResetPassword();

  async function handleResetPassword() {
    if (!resetUserId) return;
    try {
      await resetMutation.mutateAsync({
        id: resetUserId,
        password: newPassword,
      });
      toast.success("Password reset");
      setResetDialogOpen(false);
      setResetUserId(null);
      setNewPassword("");
    } catch {
      toast.error("Failed to reset password");
    }
  }

  return (
    <>
      <ResourceListPage<UserRow, UserQuery>
        title="Manage Users"
        subtitle="Add operators, accountants, and admins"
        newButtonText="Add User"
        minTableWidth="min-w-[900px]"
        emptyText="No users found"
        deleteConfirmText="Delete this user?"
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
            header: "Email",
            getValue: (item) => item.email,
          },
          {
            header: "Role",
            getValue: (item) => <StatusBadge status={item.role} />,
            valueClassName: "text-center capitalize",
          },
          {
            header: "Status",
            getValue: (item) => (
              <StatusBadge status={item.isActive ? "active" : "inactive"} />
            ),
            valueClassName: "text-center",
          },
          {
            header: "Created",
            getValue: (item) => formatDate(item.createdAt),
          },
        ]}
        getIdValue={(item) => item.id}
        useList={
          useUsers as (query: UserQuery) => {
            data?: {
              items: UserRow[];
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
        useDelete={useDeleteUser}
        renderDialog={({ open, onOpenChange, mode, value, onSuccess }) => (
          <UserDialog
            open={open}
            onOpenChange={onOpenChange}
            mode={mode}
            value={value}
            onSuccess={onSuccess}
          />
        )}
      />
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                New Password *
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                minLength={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setResetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={!newPassword || newPassword.length < 8}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
