import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RolePermissionService } from '../../services/role-permission.service';

interface MenuItem {
  icon: string;
  label: string;
  link: string;
  requiredPermissions: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  userRole: string = '';
  isLoading = true;
  userPermissions: string[] = [];
  private readonly allMenuItems: Omit<MenuItem, 'link'>[] = [
    { icon: 'chart-line', label: 'Dashboard', requiredPermissions: [] },
    {
      icon: 'tasks',
      label: 'Tasks',
      requiredPermissions: ['MANAGE_TASK', 'INTERACT_WITH_TASK'],
    },
    {
      icon: 'clipboard',
      label: 'Templates',
      requiredPermissions: ['MANAGE_TEMPLATE'],
    },
    {
      icon: 'layer-group',
      label: 'Skills',
      requiredPermissions: ['MANAGE_SKILLS'],
    },
    {
      icon: 'user-friends',
      label: 'Employees',
      requiredPermissions: ['VIEW_ALL_PROFILES'],
    },
    {
      icon: 'users-cog',
      label: 'Teams',
      requiredPermissions: ['MANAGE_TEAMS'],
    },
    {
      icon: 'comment-alt',
      label: 'Reviews',
      requiredPermissions: ['REVIEW_EMPLOYEE'],
    },
    {
      icon: 'user-graduate',
      label: 'Promotions',
      requiredPermissions: ['APPROVE_PROMOTION'],
    },
    { icon: 'user-cog', label: 'Roles', requiredPermissions: ['MANAGE_ROLES'] },
    {
      icon: 'user-edit',
      label: 'Edit User Roles',
      requiredPermissions: ['MANAGE_USERS'],
    },
    {
      icon: 'user-tie',
      label: 'Positions',
      requiredPermissions: ['MANAGE_POSITIONS'],
    },
    {
      icon: 'user-shield',
      label: 'User Management',
      requiredPermissions: ['MANAGE_USERS'],
    },
  ];

  private readonly customRoutes: Record<string, string> = {
    Teams: '/teams',
    'Profile Comments': '/profile-comments',
    'Edit User Roles': '/admin-role-edit',
  };

  constructor(
    private authService: AuthService,
    private rolePermissionService: RolePermissionService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userRole = user.role;
      this.userPermissions = user.permissions;

      if (!this.authService.permissionsLoaded) {
        await this.authService.loadPermissions().toPromise();
      }

      this.initializeMenuItems();
    }
    this.isLoading = false;
  }

  private initializeMenuItems(): void {
    this.menuItems = this.buildMenuItems();
  }

  private buildMenuItems(): MenuItem[] {
    return this.allMenuItems
      .map((item) => ({
        ...item,
        link: this.resolveMenuItemLink(item.label),
      }))
      .filter(
        (item) =>
          item.requiredPermissions.length === 0 ||
          this.authService.hasAnyPermission(item.requiredPermissions)
      );
  }

  private resolveMenuItemLink(label: string): string {
    if (label === 'Dashboard') {
      return '/dashboard';
    }
    return (
      this.customRoutes[label] || `/${label.toLowerCase().replace(' ', '-')}`
    );
  }
}
