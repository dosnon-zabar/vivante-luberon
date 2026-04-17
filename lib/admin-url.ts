/**
 * Base URLs of the chefmate-admin application.
 * Overridable via the CHEFMATE_API_URL env var at build time.
 *
 * Change ADMIN_ROOT_URL here to migrate the whole app to a new domain.
 */

export const ADMIN_ROOT_URL =
  process.env.CHEFMATE_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  "https://admin.brigades.fr";

export const ADMIN_API_URL = `${ADMIN_ROOT_URL}/api/v1`;
