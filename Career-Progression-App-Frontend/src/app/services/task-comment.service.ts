import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TaskCommentDTO } from '../model/task-comment.model';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService {
  private apiUrl = `${environment.apiUrl}/tasks/comments`;

  constructor(private http: HttpClient) { }

  getUserTaskComments(userId: number): Observable<TaskCommentDTO[]> {
    return this.http.get<TaskCommentDTO[]>(`${this.apiUrl}/user/${userId}`);
  }
} 