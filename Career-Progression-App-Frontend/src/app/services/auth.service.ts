import { EventEmitter, Injectable, NgZone, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, Subject, takeUntil, timer } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { RolePermissionService } from './role-permission.service';
import { environment } from '../../environments/environment';
import { GoogleLoginResponse } from '../model/google-login-response.model';
import { ApiResponse } from '../model/api-response.model';

interface DecodedToken {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  iat: number;
  exp: number;
  role: string;
  permission_ids?: number[];
  user_id: number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser?: SocialUser;
  private userPermissions: string[] = [];
  private tokenRefreshTimer?: any;
  private destroy$ = new Subject<void>();
  authStatusChanged = new EventEmitter<boolean>();
  pendingApproval = new EventEmitter<string>();
  inactiveUser = new EventEmitter<string>();
  errorMessage = '';
  permissionsLoaded = false;

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private ngZone: NgZone,
    private rolePermissionService: RolePermissionService
  ) {
    this.socialAuthService.authState.subscribe((user) => {
      this.currentUser = user;
      if (user?.idToken) {
        this.ngZone.run(() => this.handleGoogleLogin(user.idToken));
      } else if (!user && this.isLoggedIn()) {
        this.logout();
      }
    });

    if (this.isLoggedIn()) {
      this.loadPermissions();
      this.setupTokenRefresh();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearTokenRefresh();
  }

  private async handleGoogleLogin(idToken: string) {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<String>>(`${this.apiUrl}/google`, {
          idToken,
        })
      );
      if (response.data) {
        this.login(String(response.data));
      } else {
        console.error('Token is undefined');
      }
    } catch (error: any) {
      if (error.status === 401) {
        if (
          error.error?.message ===
          'Profile created. Waiting for admin approval.'
        ) {
          this.pendingApproval.emit(error.error.message);
          return;
        }
        if (error.error?.message === 'Your profile is not activated yet.') {
          this.inactiveUser.emit(error.error.message);
          return;
        }
      }
      this.errorMessage =
        error.error?.message || 'Failed to sign in with Google.';
    }
  }

  loadPermissions(): Observable<void> {
    return new Observable((observer) => {
      const token = localStorage.getItem('token');
      if (!token) {
        observer.complete();
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        this.rolePermissionService.loadAllData().subscribe({
          next: () => {
            this.userPermissions = (decoded.permission_ids || [])
              .map(
                (id) =>
                  this.rolePermissionService.getPermissionById(id)?.name || ''
              )
              .filter((name) => name !== '');

            const user = this.getCurrentUser();
            if (user) {
              user.permissions = this.userPermissions;
            }

            this.setupTokenRefresh();
            observer.next();
            observer.complete();
          },
          error: (err) => {
            console.error('Failed to load permissions:', err);
            this.logout();
            observer.error(err);
          },
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout();
        observer.error(error);
      }
    });
  }

  private setupTokenRefresh(): void {
    this.clearTokenRefresh();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const expiresIn = decoded.exp * 1000 - Date.now();
      const refreshTime = Math.max(expiresIn - 300000, 0);

      this.tokenRefreshTimer = this.ngZone.runOutsideAngular(() =>
        setTimeout(() => this.refreshToken(), refreshTime)
      );
    } catch (error) {
      console.error('Error setting up token refresh:', error);
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, {
          token: localStorage.getItem('token'),
        })
      );
      this.login(response.token);
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
    }
  }

  private clearTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = undefined;
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    let status = false;

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          status = true;
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        status = false;
      }
    }

    this.authStatusChanged.emit(status);
    return status;
  }

  login(token: string): void {
    localStorage.setItem('token', token);
    this.loadPermissions();
    this.authStatusChanged.emit(true);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    this.userPermissions = [];
    this.permissionsLoaded = false;
    this.clearTokenRefresh();

    try {
      if (this.currentUser) {
        await this.socialAuthService.signOut();
      }
      await firstValueFrom(this.http.post(`${this.apiUrl}/logout`, {}));
    } catch (error) {
      console.error('Error during logout:', error);
    }

    this.authStatusChanged.emit(false);
    this.ngZone.run(() => {
      this.router
        .navigate(['/login'], {
          queryParams: { returnUrl: this.router.url },
        })
        .catch((e) => console.error('Navigation error:', e));
    });
  }

  getUserInfo(): DecodedToken | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  getCurrentUser() {
    const info = this.getUserInfo();
    if (!info) return null;

    return {
      id: info.user_id,
      email: info.email,
      name: info.name || info.email,
      firstName: info.given_name,
      lastName: info.family_name,
      picture: info.picture,
      role: info.role,
      roleDetails: this.rolePermissionService.getRoleByName(info.role),
      permissions: this.userPermissions,
    };
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((perm) => this.hasPermission(perm));
  }

  permissionNamesFromIds(permissionIds: number[]): string[] {
    return permissionIds
      .map((id) => this.rolePermissionService.getPermissionById(id)?.name)
      .filter((name) => name !== undefined);
  }
}
