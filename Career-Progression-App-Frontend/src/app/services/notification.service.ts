import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Notification, NotificationFilter } from '../model/notification.model';
import { ApiResponse } from '../model/api-response.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { NotificationFilterCountDTO } from '../model/filter-count-dto.model';
import { PaginatedResponse } from '../model/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private unreadCountSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  unreadCount$ = this.unreadCountSubject.asObservable();

  updateUnreadCount(userId: number): void {
    this.getUnreadCount(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.unreadCountSubject.next(response.data);
        } else {
          console.error('Error fetching unread count:', response.message);
        }
      },
      error: (err) => {
        console.error('Error fetching unread count:', err.message || err);
      },
    });
  }

  getNotifications(
    userId: number,
    filter: NotificationFilter,
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<PaginatedResponse<Notification>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filter', filter);
  
    return this.http.get<ApiResponse<PaginatedResponse<Notification>>>(`${this.apiUrl}/${userId}`, { params });
  }
  

  getAvailableFilters(userId: number): Observable<ApiResponse<NotificationFilter[]>> {
    return this.http.get<ApiResponse<NotificationFilter[]>>(`${this.apiUrl}/${userId}/filters`);
  }
  

  getUnreadCount(userId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/${userId}/unread-count`);
  }

  getFilterCounts(userId: number): Observable<ApiResponse<NotificationFilterCountDTO[]>> {
    return this.http.get<ApiResponse<NotificationFilterCountDTO[]>>(`${this.apiUrl}/${userId}/filter-counts`);
  }
  

  markAsRead(notificationId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${notificationId}/read`, {});
  }
  

  markAllAsRead(userId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${userId}/mark-all-read`, {});
  }
  
}
