import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { ApiResponse } from '../model/api-response.model';
import { Role } from '../model/role.model';
import { Permission } from '../model/permission.model';
import { RolePermission } from '../model/role-permission.model';
import { AllRolesPermissions } from '../model/all-role-permission.model';

@Injectable({
  providedIn: 'root',
})
export class RolePermissionService {
  private apiUrl = `${environment.apiUrl}/role-permissions`;
  private roles$ = new BehaviorSubject<Role[]>([]);
  private permissions$ = new BehaviorSubject<Permission[]>([]);
  private rolePermissions$ = new BehaviorSubject<RolePermission[]>([]);
  private loaded = false;
  private cache$?: Observable<{
    roles: Role[];
    permissions: Permission[];
    rolePermissions: RolePermission[];
  }>;

  constructor(private http: HttpClient) {}

  loadAllData(): Observable<AllRolesPermissions> {
    if (this.loaded && this.cache$) {
      return this.cache$;
    }

    const cacheSubject = new BehaviorSubject<AllRolesPermissions | null>(null);

    this.http.get<ApiResponse<AllRolesPermissions>>(this.apiUrl).subscribe({
      next: (response) => {
        const data = response.data;
        this.roles$.next(data.roles);
        this.permissions$.next(data.permissions);
        this.rolePermissions$.next(data.rolePermissions);
        this.loaded = true;

        cacheSubject.next(data);
      },
      error: (error) => {
        console.error('Failed to load role permissions:', error);
        cacheSubject.error(new Error('Failed to load permissions'));
      },
    });

    this.cache$ = new Observable<AllRolesPermissions>((observer) => {
      const subscription = cacheSubject.subscribe({
        next: (data) => {
          if (data !== null) {
            observer.next(data);
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        },
      });

      return () => subscription.unsubscribe();
    });

    return this.cache$;
  }

  getRoleByName(name: string): Role | undefined {
    return this.roles$.value.find((role) => role.name === name);
  }

  getPermissionById(id: number): Permission | undefined {
    return this.permissions$.value.find((permission) => permission.id === id);
  }

  assignPermissionToRole(
    roleId: number,
    permissionId: number
  ): Observable<RolePermission> {
    return new Observable<RolePermission>((observer) => {
      this.http
        .post<RolePermission>(this.apiUrl, null, {
          params: {
            roleId: roleId.toString(),
            permissionId: permissionId.toString(),
          },
        })
        .subscribe({
          next: (newRolePermission) => {
            const current = this.rolePermissions$.value;
            this.rolePermissions$.next([...current, newRolePermission]);
            observer.next(newRolePermission);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  removePermissionFromRole(id: number): Observable<void> {
    return new Observable<void>((observer) => {
      this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          const current = this.rolePermissions$.value;
          this.rolePermissions$.next(current.filter((rp) => rp.id !== id));
          observer.next();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  getAllRoleNames(): string[] {
    return this.roles$.value.map((role) => role.name);
  }
}
