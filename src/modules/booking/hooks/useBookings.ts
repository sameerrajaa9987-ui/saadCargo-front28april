import { useQuery } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/shared-crud/createResourceHooks";
import { createResourceApi } from "@/modules/common/shared-crud/createResourceApi";
import { http } from "@/shared/api/http";
import type {
  BookingListQuery,
  BookingListResult,
  BookingPayload,
  BookingRow,
} from "../types";

const bookingApi = createResourceApi<
  BookingRow,
  BookingListQuery,
  BookingPayload
>("/bookings");

const bookingCrud = createResourceHooks<
  BookingListQuery,
  BookingPayload,
  { items: BookingRow[]; meta: BookingListResult["meta"] }
>("bookings", {
  list: bookingApi.list,
  create: bookingApi.create,
  update: bookingApi.update,
  remove: bookingApi.remove,
});

export const useBookings = bookingCrud.useList;
export const useCreateBooking = bookingCrud.useCreate;
export const useUpdateBooking = bookingCrud.useUpdate;
export const useDeleteBooking = bookingCrud.useDelete;

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const res = await http.get<{ data: BookingRow }>(`/bookings/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
