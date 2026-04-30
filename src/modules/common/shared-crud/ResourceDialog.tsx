import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";

type Mode = "create" | "edit";

export interface ResourceDialogField<TItem, TKey extends string> {
  key: TKey;
  label: string;
  placeholder: string;
  requiredMessage: string;
  getInitialValue: (item: TItem) => string;
}

interface ResourceDialogProps<
  TItem extends { id: string },
  TCreatePayload extends object,
  TKey extends string,
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  value?: TItem | null;
  onSuccess?: () => void;
  createTitle: string;
  editTitle: string;
  fields?: Array<ResourceDialogField<TItem, TKey>>;
  toPayload?: (values: Record<TKey, string>) => TCreatePayload;
  useCreate?: () => {
    isPending: boolean;
    mutateAsync: (payload: TCreatePayload) => Promise<unknown>;
  };
  useUpdate?: () => {
    isPending: boolean;
    mutateAsync: (args: {
      id: string;
      payload: Partial<TCreatePayload>;
    }) => Promise<unknown>;
  };
  dialogContentClassName?: string;
  renderBody?: () => React.ReactNode;
  customSubmit?: () => Promise<void>;
  customIsPending?: boolean;
  customDisableSubmit?: boolean;
  submitLabelCreate?: string;
  submitLabelEdit?: string;
  hideSubmitButton?: boolean;
}

export function ResourceDialog<
  TItem extends { id: string },
  TCreatePayload extends object,
  TKey extends string,
>({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
  createTitle,
  editTitle,
  fields,
  toPayload,
  useCreate,
  useUpdate,
  dialogContentClassName,
  renderBody,
  customSubmit,
  customIsPending,
  customDisableSubmit,
  submitLabelCreate,
  submitLabelEdit,
  hideSubmitButton,
}: ResourceDialogProps<TItem, TCreatePayload, TKey>) {
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<TKey, string>>(
    {} as Record<TKey, string>,
  );
  const [validation, setValidation] = useState<Partial<Record<TKey, string>>>(
    {},
  );

  const createMutation = useCreate?.();
  const updateMutation = useUpdate?.();
  const isPending =
    customIsPending ??
    Boolean(createMutation?.isPending || updateMutation?.isPending);

  const initialValues = useMemo(() => {
    const nextValues = {} as Record<TKey, string>;

    (fields ?? []).forEach((field) => {
      nextValues[field.key] =
        mode === "edit" && value ? field.getInitialValue(value) : "";
    });

    return nextValues;
  }, [fields, mode, value]);

  const currentValues = useMemo(
    () => ({ ...initialValues, ...values }),
    [initialValues, values],
  );

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setError(null);
      setValidation({});
    }
    if (!nextOpen) {
      setValues({} as Record<TKey, string>);
      setValidation({});
      setError(null);
    }
    onOpenChange(nextOpen);
  }

  async function onSubmit() {
    if (customSubmit) {
      setError(null);
      try {
        await customSubmit();
        handleOpenChange(false);
        toast.success(
          mode === "create" ? "Created successfully" : "Updated successfully",
        );
        onSuccess?.();
      } catch (e) {
        const message = getApiErrorMessage(e);
        setError(message);
        toast.error(message);
      }
      return;
    }

    if (!fields || !toPayload || !createMutation || !updateMutation) {
      setError("ResourceDialog is not configured correctly");
      return;
    }

    const cleaned = {} as Record<TKey, string>;
    const nextValidation: Partial<Record<TKey, string>> = {};

    fields.forEach((field) => {
      const cleanedValue = (currentValues[field.key] ?? "").trim();
      cleaned[field.key] = cleanedValue;

      if (!cleanedValue) {
        nextValidation[field.key] = field.requiredMessage;
      }
    });

    setValidation(nextValidation);
    if (Object.keys(nextValidation).length > 0) return;

    setError(null);

    try {
      const payload = toPayload(cleaned);
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (value?.id) {
        await updateMutation.mutateAsync({ id: value.id, payload });
      }
      handleOpenChange(false);
      toast.success(
        mode === "create" ? "Created successfully" : "Updated successfully",
      );
      onSuccess?.();
    } catch (e) {
      const message = getApiErrorMessage(e);
      setError(message);
      toast.error(message);
    }
  }

  const hasEmptyRequiredField =
    customDisableSubmit ??
    (fields
      ? fields.some((field) => !(currentValues[field.key] ?? "").trim())
      : false);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={dialogContentClassName ?? "max-w-lg"}>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? createTitle : editTitle}
          </DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {renderBody ? (
          renderBody()
        ) : (
          <div className="space-y-3 py-2">
            {(fields ?? []).map((field) => (
              <div key={field.key}>
                <label className="text-xs font-medium text-muted-foreground">
                  {field.label}
                </label>
                <Input
                  value={currentValues[field.key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                />
                {validation[field.key] ? (
                  <div className="mt-1 text-xs text-red-600">
                    {validation[field.key]}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {!hideSubmitButton ? (
          <DialogFooter showCloseButton>
            <Button
              onClick={onSubmit}
              disabled={isPending || hasEmptyRequiredField}
            >
              {isPending
                ? "Saving..."
                : mode === "create"
                  ? (submitLabelCreate ?? "Create")
                  : (submitLabelEdit ?? "Save")}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
