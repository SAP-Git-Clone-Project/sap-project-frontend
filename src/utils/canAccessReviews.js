/**
 * Reviews inbox / version-review flows are for reviewers, authors, writers, staff — not reader-only users.
 * Superusers always pass (even if global_roles is empty).
 */
export function canAccessReviews(user) {
  if (!user) return false;
  if (user.is_superuser || user.is_staff) return true;
  const roles = (user.global_roles || []).map((r) => String(r).toLowerCase());
  if (roles.length === 0) return false;
  return roles.some((r) => r !== "reader");
}
