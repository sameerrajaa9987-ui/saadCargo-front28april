import { createResourceHooks } from "@/modules/common/createResourceHooks";
import { listParties, createParty, updateParty, deleteParty } from "../api/partyApi";
import type { PartyListQuery, PartyCreatePayload, PartyListResult } from "../types";

const crud = createResourceHooks<PartyListQuery, PartyCreatePayload, PartyListResult>("parties", {
  list: listParties,
  create: createParty,
  update: updateParty,
  remove: deleteParty,
});

export const useParties = crud.useList;
export const useCreateParty = crud.useCreate;
export const useUpdateParty = crud.useUpdate;
export const useDeleteParty = crud.useDelete;
