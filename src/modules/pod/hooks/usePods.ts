import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/createResourceHooks";
import { listPods, createPod, updatePod, deletePod, updatePodStatus } from "../api/podApi";
import type { PodListQuery, PodCreatePayload, PodListResult } from "../types";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";

const crud = createResourceHooks<PodListQuery, PodCreatePayload, PodListResult>(
  "pods",
  { list: listPods, create: createPod, update: updatePod, remove: deletePod }
);

export const usePods = crud.useList;
export const useCreatePod = crud.useCreate;
export const useUpdatePod = crud.useUpdate;
export const useDeletePod = crud.useDelete;

export function useUpdatePodStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, deliveryStatus }: { id: string; deliveryStatus: string }) =>
      updatePodStatus(id, deliveryStatus),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pods"] }); toast.success("Status updated"); },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
