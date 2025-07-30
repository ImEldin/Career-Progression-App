import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { PromotionRequest, ActivePromotionRequestDTO, PromotionRequestDetailsDTO } from '../model/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private apiUrl = `${environment.apiUrl}/promotions`;

  constructor(private http: HttpClient) {}

  getApprovedPromotionsForUser(
    userId: number
  ): Observable<ApiResponse<PromotionRequest[]>> {
    return this.http.get<ApiResponse<PromotionRequest[]>>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  getActivePromotionRequests(): Observable<ApiResponse<ActivePromotionRequestDTO[]>> {
    return this.http.get<ApiResponse<ActivePromotionRequestDTO[]>>(
      `${this.apiUrl}/active`
    ).pipe(
      catchError(error => {
        console.error('Error fetching active promotion requests:', error);
        return of({ success: false, message: 'Error fetching promotion requests', data: [] });
      })
    );
  }

  getPromotionRequestDetails(promotionRequestId: number): Observable<ApiResponse<PromotionRequestDetailsDTO | null>> {
    return this.http.get<ApiResponse<PromotionRequestDetailsDTO>>(
      `${this.apiUrl}/${promotionRequestId}/details`
    ).pipe(
      catchError(error => {
        console.error('Error fetching promotion request details:', error);
        return of({ success: false, message: 'Error fetching promotion request details', data: null });
      })
    );
  }

  approvePromotionRequest(promotionRequestId: number, message?: string) {
    return this.http.patch<ApiResponse<string>>(
      `${this.apiUrl}/${promotionRequestId}/approve`,
      message ? { message } : {}
    );
  }

  rejectPromotionRequest(promotionRequestId: number, message: string) {
    return this.http.patch<ApiResponse<string>>(
      `${this.apiUrl}/${promotionRequestId}/reject`,
      { message }
    );
  }
}
