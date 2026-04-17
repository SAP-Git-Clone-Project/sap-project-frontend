/**
 * Normalizes `/users/me/` and login API user payloads into AuthContext user shape.
 */
export function mapApiUserToAuthUser(apiUser) {
  if (!apiUser) return null;
  return {
    id: apiUser.id,
    name:
      `${apiUser.first_name || ""} ${apiUser.last_name || ""}`.trim() ||
      apiUser.username,
    username: apiUser.username,
    email: apiUser.email,
    avatar: apiUser.avatar ?? null,
    is_superuser: apiUser.is_superuser ?? false,
    is_staff: apiUser.is_staff ?? false,
    is_active: apiUser.is_active ?? false,
    first_name: apiUser.first_name ?? "",
    last_name: apiUser.last_name ?? "",
    global_roles: Array.isArray(apiUser.global_roles) ? apiUser.global_roles : [],
  };
}
