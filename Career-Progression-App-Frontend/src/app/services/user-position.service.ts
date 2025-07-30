import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserPositionDTO } from '../model/user-position.model';

export interface CreateUserPositionRequest {
  userId: number;
  positionId: number;
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserPositionService {
  private apiUrl = `${environment.apiUrl}/userPositions`; 

  constructor(private http: HttpClient) {}

  getUserPositions(userId: number): Observable<UserPositionDTO[]> {
    return this.http.get<UserPositionDTO[]>(`${this.apiUrl}?userId=${userId}`);
  }

  createOrUpdateUserPosition(request: CreateUserPositionRequest): Observable<UserPositionDTO> {
    return this.http.post<UserPositionDTO>(this.apiUrl, request);
  }
}
