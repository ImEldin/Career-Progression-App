import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

import { AuthGuard } from './services/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login-view/login-view.component').then(
        (m) => m.LoginViewComponent
      ),
  },
  {
    path: 'notification',
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then(
        (m) => m.NotificationsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/tasks/tasks.component').then((m) => m.TasksComponent),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_TASK', 'INTERACT_WITH_TASK'] },
  },
  {
    path: 'task/:id',
    loadComponent: () =>
      import('./pages/task-view/task-view.component').then(
        (m) => m.TaskViewComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_TASK', 'INTERACT_WITH_TASK'] },
  },
  {
    path: 'task-view/:id',
    loadComponent: () =>
      import('./pages/task-view/task-view.component').then(
        (m) => m.TaskViewComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['INTERACT_WITH_TASK'] },
  },
  {
    path: 'task-create',
    loadComponent: () =>
      import('./pages/task-create/task-create.component').then(
        (m) => m.TaskCreateComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_TASK'] },
  },
  {
    path: 'task-edit',
    loadComponent: () =>
      import('./pages/task-edit/task-edit.component').then(
        (m) => m.TaskEditComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_TASK'] },
  },
  {
    path: 'promotions',
    loadComponent: () =>
      import('./pages/promotion-requests/promotion-requests.component').then(
        (m) => m.PromotionRequestsComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['APPROVE_PROMOTION'] },
  },
  {
    path: 'promotion-requests/:id',
    loadComponent: () =>
      import(
        './pages/promotion-request-details/promotion-request-details.component'
      ).then((m) => m.PromotionRequestDetailsComponent),
    canActivate: [AuthGuard],
    data: { permissions: ['APPROVE_PROMOTION'] },
  },
  {
    path: 'templates',
    loadComponent: () =>
      import('./pages/template/template.component').then(
        (m) => m.TemplateComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_TEMPLATE'] },
  },
  {
    path: 'template',
    loadComponent: () =>
      import('./pages/templates/templates.component').then(
        (m) => m.TemplatesComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_TEMPLATE'] },
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./pages/employees/employees.component').then(
        (m) => m.EmployeesComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['VIEW_ALL_PROFILES'] },
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./pages/reviews/reviews.component').then(
        (m) => m.ReviewsComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['REVIEW_EMPLOYEE'] },
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./pages/roles/roles.component').then((m) => m.RolesComponent),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_ROLES'] },
  },
  {
    path: 'teams',
    loadComponent: () =>
      import('./pages/teams/teams.component').then((m) => m.TeamsComponent),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_TEAMS'] },
  },
  {
    path: 'positions',
    loadComponent: () =>
      import('./pages/positions/positions.component').then(
        (m) => m.PositionsComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_POSITIONS'] },
  },
  {
    path: 'positions/form',
    loadComponent: () =>
      import('./pages/position-form/position-form.component').then(
        (m) => m.PositionFormComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_POSITIONS'] },
  },
  {
    path: 'user-management',
    loadComponent: () =>
      import('./pages/user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_USERS'] },
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then(
        (m) => m.NotificationsComponent
      ),
  },
  {
    path: 'user-profile/:userId',
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['VIEW_ALL_PROFILES'] },
  },
  {
    path: 'admin-role-edit',
    loadComponent: () =>
      import('./pages/admin-role-edit/admin-role-edit.component').then(
        (m) => m.AdminRoleEditComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_USERS'] },
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./pages/skill-management/skill-management.component').then(
        (m) => m.SkillManagementComponent
      ),
    canActivate: [AuthGuard],
    data: { permissions: ['MANAGE_SKILLS'] },
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
