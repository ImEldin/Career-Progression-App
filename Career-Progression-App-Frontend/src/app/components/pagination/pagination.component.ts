import { Component, OnInit } from '@angular/core';
import { PaginationService } from '../../services/pagination.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  currentPage: number = 0;
  totalPages: number = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(private paginationService: PaginationService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.paginationService.currentPage$.subscribe(page => {
        this.currentPage = page;
      })
    );

    this.subscriptions.add(
      this.paginationService.totalPages$.subscribe(totalPages => {
        this.totalPages = totalPages;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.paginationService.setCurrentPage(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.paginationService.setCurrentPage(this.currentPage);
    }
  }

  firstPage() {
    this.currentPage = 0;
    this.paginationService.setCurrentPage(this.currentPage);
  }

  lastPage() {
    this.currentPage = this.totalPages - 1;
    this.paginationService.setCurrentPage(this.currentPage);
  }
}
