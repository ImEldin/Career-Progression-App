import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PromotionService } from '../../services/promotion.service';
import {
  PromotionRequestDetailsDTO,
  TaskDTO,
  PromotionStatus,
} from '../../model/promotion.model';
import { TaskStatus } from '../../model/task.model';
import { TaskCommentDTO } from '../../model/task-comment.model';
import { ApiResponse } from '../../model/api-response.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-promotion-request-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './promotion-request-details.component.html',
  styleUrl: './promotion-request-details.component.css',
})
export class PromotionRequestDetailsComponent implements OnInit {
  promotionRequest: PromotionRequestDetailsDTO | null = null;
  loading = false;
  error = '';
  promotionRequestId: number = 0;
  openedPanelId: number | null = null;
  actionMessage: string = '';
  actionLoading: boolean = false;
  actionError: string = '';
  actionSuccess: string = '';

  constructor(
    private promotionService: PromotionService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.promotionRequestId = +params['id'];
      if (this.promotionRequestId) {
        this.loadPromotionRequestDetails();
      }
    });
  }

  loadPromotionRequestDetails(): void {
    this.loading = true;
    this.error = '';

    this.promotionService
      .getPromotionRequestDetails(this.promotionRequestId)
      .subscribe({
        next: (response: ApiResponse<PromotionRequestDetailsDTO | null>) => {
          this.loading = false;
          if (response.success && response.data) {
            this.promotionRequest = response.data;
          } else {
            this.error =
              response.message || 'Error loading promotion request details';
            this.snackBar.open(this.error, 'Close', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error loading promotion request details';
          console.error('Error loading promotion request details:', error);
          this.snackBar.open(this.error, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/promotions']);
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

  getTaskStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return '#C5E5E3';
      case TaskStatus.IN_PROGRESS:
        return '#F0F1B3';
      case TaskStatus.IN_REVIEW:
        return '#A3A7E4';
      case TaskStatus.DONE:
        return '#BAE2BE';
      default:
        return '#6B7280';
    }
  }

  getTaskStatusText(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.IN_REVIEW:
        return 'In Review';
      case TaskStatus.DONE:
        return 'Done';
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
      minute: '2-digit',
    });
  }

  getUserFullName(): string {
    if (!this.promotionRequest?.user) return '';
    return `${this.promotionRequest.user.firstName} ${this.promotionRequest.user.lastName}`;
  }

  getTasksBySkillType(): { [key: string]: TaskDTO[] } {
    if (!this.promotionRequest?.tasks) return {};
    return this.promotionRequest.tasks.reduce((acc, task) => {
      const skillType = task.skillType || 'Other';
      if (!acc[skillType]) {
        acc[skillType] = [];
      }
      acc[skillType].push(task);
      return acc;
    }, {} as { [key: string]: TaskDTO[] });
  }

  getTaskCompletionTime(task: TaskDTO): string {
    const startDate = new Date(task.createdAt);
    const endDate = new Date(task.updatedAt);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '1 day';
    } else if (diffDays < 7) {
      return `${diffDays} days`;
    } else {
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      if (remainingDays === 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
      } else {
        return `${weeks} week${weeks > 1 ? 's' : ''} ${remainingDays} day${
          remainingDays > 1 ? 's' : ''
        }`;
      }
    }
  }

  getCommentsForTask(taskId: number): TaskCommentDTO[] {
    if (!this.promotionRequest?.taskComments) return [];
    return this.promotionRequest.taskComments.filter(
      (comment) => comment.taskId === taskId
    );
  }

  hasAiReport(): boolean {
    return !!(
      this.promotionRequest?.aiReport && this.promotionRequest.aiReport.trim()
    );
  }

  formatAiReport(): string {
    if (!this.promotionRequest?.aiReport) return '';
    let text = this.promotionRequest.aiReport;

    text = text.replace(/^####(.*)$/gim, '<h4>$1</h4>');
    text = text.replace(/^### (.*)$/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*)$/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*)$/gim, '<h1>$1</h1>');

    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    text = text.replace(/---/g, '<hr>');

    text = text.replace(/\n/g, '<br>');
    return text;
  }

  togglePanel(id: number) {
    this.openedPanelId = this.openedPanelId === id ? null : id;
  }

  approveRequest() {
    this.actionLoading = true;
    this.actionError = '';
    this.actionSuccess = '';
    this.promotionService
      .approvePromotionRequest(this.promotionRequestId, this.actionMessage)
      .subscribe({
        next: (response) => {
          this.actionLoading = false;
          if (response.success) {
            this.actionSuccess =
              response.message || 'Promotion request approved successfully.';
            this.router.navigate(['/promotions']);
          } else {
            this.actionError =
              response.message || 'Failed to approve promotion request.';
          }
        },
        error: (err) => {
          this.actionLoading = false;
          this.actionError = 'Failed to approve promotion request.';
        },
      });
  }

  rejectRequest() {
    if (!this.actionMessage.trim()) {
      this.actionError = 'Rejection reason is required.';
      return;
    }
    this.actionLoading = true;
    this.actionError = '';
    this.actionSuccess = '';
    this.promotionService
      .rejectPromotionRequest(this.promotionRequestId, this.actionMessage)
      .subscribe({
        next: (response) => {
          this.actionLoading = false;
          if (response.success) {
            this.actionSuccess =
              response.message || 'Promotion request rejected successfully.';
            this.router.navigate(['/promotions']);
          } else {
            this.actionError =
              response.message || 'Failed to reject promotion request.';
          }
        },
        error: (err) => {
          this.actionLoading = false;
          this.actionError = 'Failed to reject promotion request.';
        },
      });
  }
}
