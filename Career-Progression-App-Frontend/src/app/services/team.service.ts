import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Team } from '../model/team.model';
import { ApiResponse } from '../model/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  addTeam(teamPayload: Team): Observable<ApiResponse<Team>> {
    return this.http.post<ApiResponse<Team>>(`${this.apiUrl}/add`, teamPayload);
  }

  editTeam(teamId: number, teamPayload: Team): Observable<ApiResponse<Team>> {
    return this.http.put<ApiResponse<Team>>(
      `${this.apiUrl}/update/${teamId}`,
      teamPayload
    );
  }

  deleteTeam(teamId: number) {
    return this.http.delete(`${this.apiUrl}/delete/${teamId}`);
  }
}
