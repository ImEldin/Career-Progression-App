import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';
import { User } from '../../model/user.model';
import { Task, TaskStatus } from '../../model/task.model';
import { FormsModule } from '@angular/forms';
import {
  UserPositionService,
  CreateUserPositionRequest,
} from '../../services/user-position.service';
import { PositionService } from '../../services/position.service';
import { Position } from '../../model/position.model';
import { UserPositionDTO } from '../../model/user-position.model';
import { Review } from '../../model/review.model';
import { ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { PromotionService } from '../../services/promotion.service';
import { PromotionRequest, PromotionStatus } from '../../model/promotion.model';
import { TaskCommentService } from '../../services/task-comment.service';
import { TaskCommentDTO } from '../../model/task-comment.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AIReportDialogComponent } from '../../components/ai-report-dialog/ai-report-dialog.component';
import { ManageSkillsDialogComponent } from '../../components/manage-skills-dialog/manage-skills-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    TimeAgoPipe,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class UserProfileComponent implements OnInit {
  user!: User;
  progressPercentage: number = 0;
  assignedTasks: Task[] = [];
  currentLevel!: number;
  nextLevel!: number;
  isLoading = true;
  teamLeadReviews: Review[] = [];
  achievements: PromotionRequest[] = [];
  allPositions: Position[] = [];
  userPositions: UserPositionDTO[] = [];
  currentUserPosition: UserPositionDTO | null = null;
  positionForm: FormGroup;
  isManagingPosition = false;
  isSavingPosition = false;
  taskComments: TaskCommentDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private taskService: TaskService,
    private userPositionService: UserPositionService,
    private positionService: PositionService,
    private reviewService: ReviewService,
    private promotionService: PromotionService,
    private taskCommentService: TaskCommentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.positionForm = this.fb.group({
      positionId: ['', Validators.required],
      level: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  ngOnInit(): void {
    this.loadAllPositions();
    this.loadUser();
  }

  private loadAllPositions(): void {
    this.positionService.getAllPositions().subscribe({
      next: (positions) => {
        this.allPositions = positions;
      },
      error: (error) => {
        console.error('Error fetching positions:', error);
      },
    });
  }

  loadUser(): void {
    this.route.params.subscribe((params) => {
      const userId = params['userId'];
      this.userService.getUserById(userId).subscribe((user) => {
        this.user = user;
        this.loadTasks(userId);
        this.loadUserPositions(userId);
        this.loadTeamLeadReviews(userId);
        this.loadApprovedPromotions(userId);
        this.loadUserTaskComments(userId);
      });
    });
  }

  private loadApprovedPromotions(userId: number): void {
    this.promotionService.getApprovedPromotionsForUser(userId).subscribe({
      next: (promotions) => {
        this.achievements = promotions.data || promotions;
      },
      error: (error) => {
        console.error('Error fetching promotions:', error);
      },
    });
  }

  private loadTeamLeadReviews(userId: number): void {
    this.reviewService.getReviewsByUserId(userId).subscribe({
      next: (reviews) => {
        this.teamLeadReviews = reviews;
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
      },
    });
  }

  private loadUserPositions(userId: number): void {
    this.userPositionService.getUserPositions(userId).subscribe({
      next: (positions) => {
        this.userPositions = positions;
        if (positions.length > 0) {
          this.currentUserPosition = positions[0];
          this.currentLevel = positions[0].currentLevel;
          this.nextLevel = positions[0].nextLevel;

          this.positionForm.patchValue({
            positionId: positions[0].positionId,
            level: positions[0].currentLevel,
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user positions:', error);
        this.isLoading = false;
      },
    });
  }

  loadTasks(userId: number): void {
    this.taskService.getTasksAssignedToUser(userId).subscribe({
      next: (response) => {
        this.assignedTasks = response.data;
        this.calculateProgress(this.assignedTasks);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  calculateProgress(tasks: Task[]): void {
    const inReviewCount = tasks.filter(
      (t) => t.status === TaskStatus.IN_REVIEW
    ).length;
    const todoCount = tasks.filter((t) => t.status === TaskStatus.TODO).length;
    const inProgressCount = tasks.filter(
      (t) => t.status === TaskStatus.IN_PROGRESS
    ).length;

    const total = inReviewCount + todoCount + inProgressCount;
    const progressPercentage =
      total > 0 ? Math.round((inReviewCount / total) * 100) : 0;

    this.progressPercentage = progressPercentage;
  }

  getCompletedTasksCount(): number {
    return this.assignedTasks.filter((t) => t.status === TaskStatus.DONE)
      .length;
  }

  getInreviewTasksCount(): number {
    return this.assignedTasks.filter((t) => t.status === TaskStatus.IN_REVIEW)
      .length;
  }

  getPendingTasksCount(): number {
    return this.assignedTasks.filter((t) => t.status === TaskStatus.TODO)
      .length;
  }

  getOngoingTasksCount(): number {
    return this.assignedTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS)
      .length;
  }

  getAchievementTitle(achievement: PromotionRequest): string {
    if (achievement.status === PromotionStatus.APPROVED) {
      return achievement.message || 'Promotion approved';
    }
    return achievement.message || 'Promotion request';
  }

  openManagePosition(): void {
    this.isManagingPosition = true;
  }

  closeManagePosition(): void {
    this.isManagingPosition = false;
    if (this.currentUserPosition) {
      this.positionForm.patchValue({
        positionId: this.currentUserPosition.positionId,
        level: this.currentUserPosition.currentLevel,
      });
    }
  }

  savePosition(): void {
    if (this.positionForm.valid && this.user) {
      this.isSavingPosition = true;

      const request: CreateUserPositionRequest = {
        userId: this.user.id,
        positionId: this.positionForm.value.positionId,
        level: this.positionForm.value.level,
      };

      this.userPositionService.createOrUpdateUserPosition(request).subscribe({
        next: (response) => {
          this.currentUserPosition = response;
          this.currentLevel = response.currentLevel;
          this.nextLevel = response.nextLevel;
          this.userPositions = [response];

          this.isManagingPosition = false;
          this.isSavingPosition = false;

          this.snackBar.open('Position updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
        error: (error) => {
          console.error('Error updating position:', error);
          this.isSavingPosition = false;
          this.snackBar.open(
            'Error updating position. Please try again.',
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
        },
      });
    }
  }

  getCurrentPositionName(): string {
    if (this.currentUserPosition) {
      const position = this.allPositions.find(
        (p) => p.id === this.currentUserPosition!.positionId
      );
      return position ? position.name : 'Unknown Position';
    }
    return 'No Position';
  }

  private loadUserTaskComments(userId: number): void {
    this.taskCommentService.getUserTaskComments(userId).subscribe({
      next: (comments: any) => {
        if (comments && Array.isArray(comments.data)) {
          this.taskComments = comments.data;
        } else if (Array.isArray(comments)) {
          this.taskComments = comments;
        } else {
          this.taskComments = [];
        }
      },
      error: (error: any) => {
        console.error('Error fetching task comments:', error);
        this.taskComments = [];
      },
    });
  }

  openAIReportDialog(achievement: PromotionRequest): void {
    this.dialog.open(AIReportDialogComponent, {
      width: '900px',
      maxWidth: '90vw',
      height: '900px',
      maxHeight: '80vh',
      data: { report: achievement.ai_report },
    });
  }

  openManageSkillsDialog(user: User): void {
    const dialogRef = this.dialog.open(ManageSkillsDialogComponent, {
      width: '400px',
      data: { userId: user.id },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.loadUser();
      }
    });
  }
}
