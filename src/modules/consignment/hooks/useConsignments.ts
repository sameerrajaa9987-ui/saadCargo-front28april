import { createResourceHooks } from "@/modules/common/createResourceHooks";
import {
  listConsignments,
  createConsignment,
  updateConsignment,
  deleteConsignment,
} from "../api/consignmentApi";
import type {
  ConsignmentListQuery,
  ConsignmentCreatePayload,
  ConsignmentListResult,
} from "../types";

const crud = createResourceHooks<
  ConsignmentListQuery,
  ConsignmentCreatePayload,
  ConsignmentListResult
>("consignments", {
  list: listConsignments,
  create: createConsignment,
  update: updateConsignment,
  remove: deleteConsignment,
});

export const useConsignments = crud.useList;
export const useCreateConsignment = crud.useCreate;
export const useUpdateConsignment = crud.useUpdate;
export const useDeleteConsignment = crud.useDelete;
