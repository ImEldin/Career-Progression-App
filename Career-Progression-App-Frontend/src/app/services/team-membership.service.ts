import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Team } from '../model/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamMembershipService {
  private apiUrl = `${environment.apiUrl}/team-memberships`;

  constructor(private http: HttpClient) { }

  getTeamsForUser(userId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/user/${userId}/teams`);
  }

  getUsersForTeam(teamId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/team/${teamId}/users`);
  }

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams`);
  }
}