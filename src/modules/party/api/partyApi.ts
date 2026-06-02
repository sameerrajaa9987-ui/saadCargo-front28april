import { createResourceApi } from "@/modules/common/createResourceApi";
import type { Party, PartyListQuery, PartyCreatePayload } from "../types";

const api = createResourceApi<Party, PartyListQuery, PartyCreatePayload>("/parties");

export const listParties = (query: PartyListQuery) => api.list(query);
export const createParty = (payload: PartyCreatePayload) => api.create(payload);
export const updateParty = (id: string, payload: Partial<PartyCreatePayload>) =>
  api.update(id, payload);
export const deleteParty = (id: string) => api.remove(id);
