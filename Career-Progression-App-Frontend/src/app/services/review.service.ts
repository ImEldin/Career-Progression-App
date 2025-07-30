import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Review } from '../model/review.model';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;
  private userApiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getReviewsByUserId(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`).pipe(
      switchMap(reviews => {
        const reviewerIds = reviews.map(review => review.reviewerId);
        const userRequests = reviewerIds.map(id => this.getUserById(id));
        return forkJoin(userRequests).pipe(
          map(users => {
            return reviews.map(review => {
              const reviewer = users.find(user => user.id === review.reviewerId);
              return { ...review, reviewer };
            });
          })
        );
      })
    );
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/${userId}`);
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }
}