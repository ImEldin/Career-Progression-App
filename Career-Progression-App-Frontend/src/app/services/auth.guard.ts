import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  role: string;
  permission_ids?: number[];
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.redirectToLogin(state.url);
      return false;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        await this.authService.logout();
        this.redirectToLogin(state.url);
        return false;
      }

      if (!this.authService.permissionsLoaded) {
        await this.authService.loadPermissions().toPromise();
      }

      if (
        !this.checkRoles(route, decoded.role) ||
        !this.checkPermissions(route)
      ) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      await this.authService.logout();
      this.redirectToLogin(state.url);
      return false;
    }
  }

  private checkRoles(route: ActivatedRouteSnapshot, userRole: string): boolean {
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      this.router.navigate(['/unauthorized'], {
        state: { missingRoles: requiredRoles },
      });
      return false;
    }
    return true;
  }

  private checkPermissions(route: ActivatedRouteSnapshot): boolean {
    const requiredPermissions = route.data['permissions'] as string[];
    if (
      requiredPermissions?.length > 0 &&
      !this.authService.hasAnyPermission(requiredPermissions)
    ) {
      this.router.navigate(['/unauthorized'], {
        state: { missingPermissions: requiredPermissions },
      });
      return false;
    }
    return true;
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl },
    });
  }
}
