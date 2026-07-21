import type { SessionUser } from "@/lib/auth";
import type { PermissionKey } from "@/lib/constants";

export function hasPermission(
  user: SessionUser,
  permission: PermissionKey,
): boolean {
  return user.permissions.includes(permission);
}
