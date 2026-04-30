import { useState } from "react";
import { ResourceDialog } from "@/modules/common/shared-crud/ResourceDialog";
import {
  useCreateClient,
  useUpdateClient,
} from "@/modules/settings/hooks/useClients";
import type { ClientRow } from "@/modules/settings/types";
import { Input } from "@/components/ui/input";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: ClientRow | null;
  onSuccess: () => void;
}

export function ClientDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: ClientDialogProps) {
  const initialForm =
    mode === "edit" && value
      ? {
          name: value.name,
          phone: value.phone || "",
          email: value.email || "",
          address: value.address || "",
        }
      : { name: "", phone: "", email: "", address: "" };

  const [form, setForm] = useState({
    name: initialForm.name,
    phone: initialForm.phone,
    email: initialForm.email,
    address: initialForm.address,
  });

  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  if (!open) return null;

  async function customSubmit() {
    const payload = {
      name: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      address: form.address || undefined,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (value?.id) {
      await updateMutation.mutateAsync({ id: value.id, payload });
    }
  }

  return (
    <ResourceDialog<
      ClientRow,
      { name: string; phone?: string; email?: string; address?: string },
      keyof ClientRow
    >
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      value={value}
      onSuccess={onSuccess}
      createTitle="Add Client"
      editTitle="Edit Client"
      customSubmit={customSubmit}
      customIsPending={createMutation.isPending || updateMutation.isPending}
      customDisableSubmit={!form.name.trim()}
      submitLabelCreate="Add Client"
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
              placeholder="Client name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Phone
            </label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Email
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
              Address
            </label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Address"
            />
          </div>
        </div>
      )}
    />
  );
}
