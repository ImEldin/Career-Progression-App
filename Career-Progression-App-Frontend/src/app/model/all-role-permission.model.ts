import { Permission } from "./permission.model";
import { RolePermission } from "./role-permission.model";
import { Role } from "./role.model";

export interface AllRolesPermissions {
  roles: Role[];
  permissions: Permission[];
  rolePermissions: RolePermission[];
}