import { useState } from "react";
import { ResourceDialog } from "@/modules/common/shared-crud/ResourceDialog";
import {
  useCreateUser,
  useUpdateUser,
} from "@/modules/settings/hooks/useUsers";
import type { UserRow } from "@/modules/settings/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: UserRow | null;
  onSuccess: () => void;
}

export function UserDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: UserDialogProps) {
  const initialForm =
    mode === "edit" && value
      ? {
          name: value.name,
          email: value.email,
          role: value.role,
          password: "",
        }
      : { name: "", email: "", role: "operator", password: "" };

  const [form, setForm] = useState({
    name: initialForm.name,
    email: initialForm.email,
    role: initialForm.role,
    password: initialForm.password,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  if (!open) return null;

  async function customSubmit() {
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role as "admin" | "operator" | "accountant",
    };

    if (mode === "create") {
      await createMutation.mutateAsync({
        ...payload,
        password: form.password,
      });
    } else if (value?.id) {
      await updateMutation.mutateAsync({ id: value.id, payload });
    }
  }

  return (
    <ResourceDialog<
      UserRow,
      {
        name: string;
        email: string;
        role: "admin" | "operator" | "accountant";
        password: string;
      },
      keyof UserRow
    >
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      value={value}
      onSuccess={onSuccess}
      createTitle="Add User"
      editTitle="Edit User"
      customSubmit={customSubmit}
      customIsPending={createMutation.isPending || updateMutation.isPending}
      customDisableSubmit={
        mode === "create"
          ? !form.name || !form.email || !form.password
          : !form.name || !form.email
      }
      submitLabelCreate="Create User"
      submitLabelEdit="Save"
      renderBody={() => (
        <div className="space-y-3 py-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Name *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="User name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Email *
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Role *
            </label>
            <Select
              value={form.role}
              onValueChange={(value) => setForm({ ...form, role: value ?? "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Password *
            </label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password (min 8 characters)"
              minLength={8}
            />
          </div>
        </div>
      )}
    />
  );
}
