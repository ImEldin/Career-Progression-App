import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { Position } from '../model/position.model';
import { Team } from '../model/team.model';
import { ApiResponse } from '../model/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getInactiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`, {
      params: { active: 'false' },
    });
  }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`, {
      params: { active: 'true' },
    });
  }

  toggleUserActive(
    userId: number,
    active: boolean
  ): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.apiUrl}/${userId}/active`,
      { active },
      { headers: this.getAuthHeader() }
    );
  }

  filterUsers(params: {
    active?: boolean;
    name?: string;
    positionIds?: number[];
    teamIds?: number[];
  }): Observable<User[]> {
    const queryParams: any = {};
    if (params.active !== undefined) queryParams.active = params.active;
    if (params.name) queryParams.name = params.name;
    if (params.positionIds && params.positionIds.length) {
      queryParams.positionIds = params.positionIds;
    }
    if (params.teamIds && params.teamIds.length) {
      queryParams.teamIds = params.teamIds;
    }

    return this.http.get<User[]>(`${this.apiUrl}`, { params: queryParams });
  }

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${environment.apiUrl}/positions`);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${environment.apiUrl}/teams`);
  }

  activateUser(userId: number): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.apiUrl}/activate/${userId}`,
      {},
      { headers: this.getAuthHeader() }
    );
  }

  deactivateUser(userId: number): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.apiUrl}/deactivate/${userId}`,
      {},
      { headers: this.getAuthHeader() }
    );
  }

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  updateUserRole(userId: number, roleName: string) {
    return this.http.patch(`${this.apiUrl}/${userId}/role`, roleName, {
      headers: this.getAuthHeader(),
      responseType: 'text',
    });
  }

  deleteUserRole(userId: number) {
    return this.http.delete(`${this.apiUrl}/${userId}/role`, {
      headers: this.getAuthHeader(),
      responseType: 'text',
    });
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  saveFeedback(userId: number, feedback: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/${userId}/feedback`, feedback, {
      responseType: 'text',
    });
  }

  updateUserSkills(userId: number, skillIds: number[]): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/skills/users/${userId}/skills`,
      skillIds,
      { headers: this.getAuthHeader(), responseType: 'text' as 'json' }
    );
  }
}
