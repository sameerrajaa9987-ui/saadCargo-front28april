/**
 * Shared query constants used across modules.
 *
 * MASTER_LIST_LIMIT is the page size used when loading reference/master data
 * (e.g. parties for a dropdown) in a single shot. It must stay in sync with
 * the backend's max page size cap (currently 200 — see
 * `saadcargo-back/src/utils/validationPrimitives.js`).
 */
export const MASTER_LIST_LIMIT = 200;
