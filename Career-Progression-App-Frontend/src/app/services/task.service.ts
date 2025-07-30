import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Observable } from 'rxjs';
import { Task } from '../model/task.model';
import { PaginatedResponse } from '../model/paginated-response.model';
import { map, catchError } from 'rxjs/operators';

export interface PositionDTO {
  id: number;
  name: string;
}

export interface TeamDTO {
  id: number;
  name: string;
}

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  active: boolean;
  profilePictureUrl?: string;
  teamNames: string[];
}

export interface CreateTaskDTO {
  title: string;
  templateId: number;
  description: string;
  userIds: number[];
}

export interface UpdateTaskDTO {
  templateId: number;
  description: string;
  status?: string;
  comment?: string;
}

export interface TaskDetailsDTO {
  id: number;
  title: string;
  description: string;
  templateId: number;
  templateName: string;
}

export interface TaskSearchParams {
  userId?: number;
  teamName?: string;
  positionId?: number;
  status?: string;
  templateId?: number;
  searchQuery?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly apiUrl = `${this.baseUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getTasksAssignedToUser(userId: number): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/user/${userId}/all`);
  }

  getTasksByStatus(userId: number, status: string): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/user/${userId}/status/${status}`);
  }

  getTasksByUser(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/user/${userId}`);
  }


  getPositions(): Observable<PositionDTO[]> {
    return this.http.get<PositionDTO[]>(`${this.baseUrl}/api/positions`);
  }

  getTeams(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/api/teams/names`).pipe(
      map(response => response.data)
    );
  }

  getUsersByPositions(positionIds: number[]): Observable<UserDTO[]> {
    const params: any = {};
    if (positionIds && positionIds.length) {
      params.positionIds = positionIds.join(',');
    }
    return this.http.get<UserDTO[]>(`${this.baseUrl}/api/users`, { params });
  }

  getUsersByTeams(teamIds: number[]): Observable<UserDTO[]> {
    const params: any = {};
    if (teamIds && teamIds.length) {
      params.teamIds = teamIds.join(',');
    }
    return this.http.get<UserDTO[]>(`${this.baseUrl}/api/users`, { params });
  }

  createTask(payload: CreateTaskDTO): Observable<string> {
    return this.http.post(`${this.apiUrl}/assign`, payload, {
      responseType: 'text'
    }).pipe(
      catchError(error => {
        let errorMessage = 'An unexpected error occurred';
        
        if (error.error) {
          try {
            const errorObj = typeof error.error === 'object' ? error.error : JSON.parse(error.error);
            if (errorObj && errorObj.message) {
              errorMessage = errorObj.message;
            }
          } catch (e) {
            errorMessage = error.error;
          }
        }
        
        throw errorMessage;
      })
    );
  }

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/api/users`);
  }

  searchTasks(params: TaskSearchParams): Observable<ApiResponse<PaginatedResponse<Task>>> {
    let queryParams = new HttpParams();
    
    if (params.userId) queryParams = queryParams.set('userId', params.userId.toString());
    if (params.teamName) queryParams = queryParams.set('teamName', params.teamName);
    if (params.positionId) queryParams = queryParams.set('positionId', params.positionId.toString());
    if (params.status) queryParams = queryParams.set('status', params.status);
    if (params.templateId) queryParams = queryParams.set('templateId', params.templateId.toString());
    if (params.searchQuery) queryParams = queryParams.set('searchQuery', params.searchQuery);
    if (params.page !== undefined) queryParams = queryParams.set('page', params.page.toString());
    if (params.size !== undefined) queryParams = queryParams.set('size', params.size.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Task>>>(`${this.apiUrl}/search`, { params: queryParams });
  }

  deleteTask(taskId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${taskId}`);
  }

  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${taskId}`).pipe(
      map(response => response.data)
    );
  }

  updateTask(taskId: number, payload: UpdateTaskDTO): Observable<string> {
    return this.http.put(`${this.apiUrl}/edit/${taskId}`, payload, {
      responseType: 'text'
    }).pipe(
      catchError(error => {
        let errorMessage = 'An unexpected error occurred';
        
        if (error.error) {
          try {
            const errorObj = typeof error.error === 'object' ? error.error : JSON.parse(error.error);
            if (errorObj && errorObj.message) {
              errorMessage = errorObj.message;
            }
          } catch (e) {
            errorMessage = error.error;
          }
        }
        
        throw errorMessage;
      })
    );
  }

  getTasksInReview(teamLeadId: number, params: TaskSearchParams): Observable<ApiResponse<PaginatedResponse<Task>>> {
    let queryParams = new HttpParams();
    
    if (params.userId) queryParams = queryParams.set('userId', params.userId.toString());
    if (params.searchQuery) queryParams = queryParams.set('searchQuery', params.searchQuery);
    if (params.page !== undefined) queryParams = queryParams.set('page', params.page.toString());
    if (params.size !== undefined) queryParams = queryParams.set('size', params.size.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Task>>>(`${this.apiUrl}/team-lead/${teamLeadId}/in-review`, { params: queryParams });
  }

  reviewTask(taskId: number, comment: string, approved: boolean, reviewerId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/${taskId}/review?reviewerId=${reviewerId}`,
      { comment, approved }
    );
  }

  updateTaskStatus(taskId: number, status: string): Observable<ApiResponse<Task>> {
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${taskId}/status`, { status });
  }
}
