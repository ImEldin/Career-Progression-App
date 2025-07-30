import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TemplateDTO {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<TemplateDTO[]> {
    return this.http.get<TemplateDTO[]>(`${this.baseUrl}/api/template/all`).pipe(
      catchError(error => {
        console.error('Error fetching templates:', error);
        throw error;
      })
    );
  }
} 