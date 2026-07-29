/**
 * Julio's code-provisioned account uses a deterministic MongoDB identity.
 * MongoDB's built-in unique `_id` index makes concurrent provisioning attempts
 * atomic: at most one of them can create the sole teacher account.
 */
export const ADMIN_SINGLETON_ID = "000000000000000000000001";
