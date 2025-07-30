import { Permission } from "./permission.model";
import { Role } from "./role.model";

export interface RolePermission {
  id: number;
  role: Role;
  permission: Permission;
}