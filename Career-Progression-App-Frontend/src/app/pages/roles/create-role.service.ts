import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RoleDTO {
  id: number;
  name: string;
  permissionNames: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CreateRoleService {
  private readonly apiUrl = `${environment.apiUrl}/role/permissions`;
  private baseUrl = `${environment.apiUrl}/role`;

  constructor(private http: HttpClient) {}

  getAllPermissions(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  createRole(name: string, permissionNames: string[]): Observable<any> {
    const payload = { name, permissionNames };
    return this.http.post(`${this.baseUrl}/selectedPermissions`, payload);
  }

  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(`${this.baseUrl}/all`);
  }

  updateRole(
    id: number,
    name: string,
    permissionNames: string[]
  ): Observable<string> {
    const payload = { name, permissionNames };
    return this.http.put(`${this.baseUrl}/${id}`, payload, {
      responseType: 'text',
    });
  }

  deleteRole(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text',
    });
  }
}
