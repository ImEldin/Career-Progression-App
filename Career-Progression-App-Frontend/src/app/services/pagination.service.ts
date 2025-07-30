import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private currentPageSubject = new BehaviorSubject<number>(0);
  private totalPagesSubject = new BehaviorSubject<number>(0);

  currentPage$: Observable<number> = this.currentPageSubject.asObservable();
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
  }

  setTotalPages(totalPages: number): void {
    this.totalPagesSubject.next(totalPages);
  }
}
