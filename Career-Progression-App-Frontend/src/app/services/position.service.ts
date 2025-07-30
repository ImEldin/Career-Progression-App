import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Position } from '../model/position.model';

@Injectable({
  providedIn: 'root',
})
export class PositionService {

  private apiUrl = `${environment.apiUrl}/positions`; 

  constructor(private http: HttpClient) { }

  getAllPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(this.apiUrl);
  }

  getPositionById(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.apiUrl}/${id}`);
  }

  createPosition(position: Position): Observable<Position> {
    return this.http.post<Position>(this.apiUrl, position);
  }

  updatePosition(id: number, position: Position): Observable<Position> {
    return this.http.put<Position>(`${this.apiUrl}/${id}`, position);
  }
}
