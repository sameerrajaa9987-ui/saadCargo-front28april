import { useQuery } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/shared-crud/createResourceHooks";
import { createResourceApi } from "@/modules/common/shared-crud/createResourceApi";
import { http } from "@/shared/api/http";
import type {
  RailwayBookingListQuery,
  RailwayBookingListResult,
  RailwayBookingPayload,
  RailwayBookingRow,
} from "../types";

const railwayBookingApi = createResourceApi<
  RailwayBookingRow,
  RailwayBookingListQuery,
  RailwayBookingPayload
>("/railway-bookings");

const railwayBookingCrud = createResourceHooks<
  RailwayBookingListQuery,
  RailwayBookingPayload,
  { items: RailwayBookingRow[]; meta: RailwayBookingListResult["meta"] }
>("railway-bookings", {
  list: railwayBookingApi.list,
  create: railwayBookingApi.create,
  update: railwayBookingApi.update,
  remove: railwayBookingApi.remove,
});

export const useRailwayBookings = railwayBookingCrud.useList;
export const useCreateRailwayBooking = railwayBookingCrud.useCreate;
export const useUpdateRailwayBooking = railwayBookingCrud.useUpdate;
export const useDeleteRailwayBooking = railwayBookingCrud.useDelete;

export function useRailwayBooking(id: string) {
  return useQuery({
    queryKey: ["railway-booking", id],
    queryFn: async () => {
      const res = await http.get<{ data: RailwayBookingRow }>(
        `/railway-bookings/${id}`,
      );
      return res.data.data;
    },
    enabled: !!id,
  });
}
