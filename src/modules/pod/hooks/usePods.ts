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
      mobile?: string;
    }) => updatePodStatus(id, deliveryStatus),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["pods"] });
      const label = vars.statusLabel ?? vars.deliveryStatus;
      toast.success(
        vars.mobile
          ? `Status updated to "${label}" — message sent to ${vars.mobile}`
          : `Status updated to "${label}"`,
      );
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
