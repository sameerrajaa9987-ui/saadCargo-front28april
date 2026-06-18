import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/createResourceHooks";
import { listPods, createPod, updatePod, deletePod, updatePodStatus } from "../api/podApi";
import type { PodListQuery, PodCreatePayload, PodListResult } from "../types";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";

const crud = createResourceHooks<PodListQuery, PodCreatePayload, PodListResult>("pods", {
  list: listPods,
  create: createPod,
  update: updatePod,
  remove: deletePod,
});

export const usePods = crud.useList;
export const useCreatePod = crud.useCreate;
export const useUpdatePod = crud.useUpdate;
export const useDeletePod = crud.useDelete;

export function useUpdatePodStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      deliveryStatus,
    }: {
      id: string;
      deliveryStatus: string;
      statusLabel?: string;
    }) => updatePodStatus(id, deliveryStatus),
    onSuccess: (result, vars) => {
      qc.invalidateQueries({ queryKey: ["pods"] });
      const label = vars.statusLabel ?? vars.deliveryStatus;
      const sms = result.sms;

      if (sms?.attempted) {
        const failed = sms.results?.filter((r) => !r.sent) ?? [];
        if (sms.sent) {
          toast.success(`Status updated to "${label}" — SMS sent to ${sms.sentTo?.join(", ")}`);
          // Partial: some numbers went through, some didn't.
          if (failed.length)
            toast.error(`SMS failed for ${failed.map((r) => r.mobile).join(", ")}`);
        } else {
          // Status saved, but msg91 rejected every SMS — surface it separately.
          toast.success(`Status updated to "${label}"`);
          toast.error("SMS could not be sent");
        }
      } else if (sms?.reason === "no_mobile") {
        toast.success(`Status updated to "${label}" — no mobile on file, SMS skipped`);
      } else {
        // no template for this status, or SMS disabled on the server
        toast.success(`Status updated to "${label}"`);
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
