import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PromotionService } from '../../services/promotion.service';
import { ActivePromotionRequestDTO, PromotionStatus } from '../../model/promotion.model';
import { ApiResponse } from '../../model/api-response.model';

@Component({
  selector: 'app-promotion-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './promotion-requests.component.html',
  styleUrl: './promotion-requests.component.css'
})
export class PromotionRequestsComponent implements OnInit {
  promotionRequests: ActivePromotionRequestDTO[] = [];
  loading = false;
  error = '';

  constructor(
    private promotionService: PromotionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPromotionRequests();
  }

  loadPromotionRequests(): void {
    this.loading = true;
    this.error = '';

    this.promotionService.getActivePromotionRequests().subscribe({
      next: (response: ApiResponse<ActivePromotionRequestDTO[]>) => {
        this.loading = false;
        if (response.success) {
          this.promotionRequests = response.data;
        } else {
          this.error = response.message || 'Error loading promotion requests';
          this.snackBar.open(this.error, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error loading promotion requests';
        console.error('Error loading promotion requests:', error);
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  viewDetails(promotionRequest: ActivePromotionRequestDTO): void {
    this.router.navigate(['/promotion-requests', promotionRequest.id]);
  }

  getStatusColor(status: PromotionStatus): string {
    switch (status) {
      case PromotionStatus.PENDING:
        return '#FFA726'; // Orange
      case PromotionStatus.APPROVED:
        return '#66BB6A'; // Green
      case PromotionStatus.REJECTED:
        return '#EF5350'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  }

  getStatusText(status: PromotionStatus): string {
    switch (status) {
      case PromotionStatus.PENDING:
        return 'Pending';
      case PromotionStatus.APPROVED:
        return 'Approved';
      case PromotionStatus.REJECTED:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}