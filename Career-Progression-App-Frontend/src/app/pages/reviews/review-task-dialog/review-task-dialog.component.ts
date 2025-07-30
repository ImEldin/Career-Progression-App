import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task, TaskStatus } from '../../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { getStatusIcon, formatTaskStatus } from '../../../utils/task.utils';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-review-task-dialog',
  templateUrl: './review-task-dialog.component.html',
  styleUrls: ['./review-task-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule
  ]
})
export class ReviewTaskDialogComponent implements OnInit {
  reviewForm: FormGroup;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<ReviewTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.reviewForm = this.formBuilder.group({
      comment: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  getStatusIcon = getStatusIcon;
  formatTaskStatus = formatTaskStatus;

  onApprove(): void {
    if (this.reviewForm.valid) {
      this.loading = true;
      const comment = this.reviewForm.get('comment')?.value;

      const token = localStorage.getItem('token');
      let reviewerId: number | undefined = undefined;
      if (token) {
        const decoded: any = jwtDecode(token);
        reviewerId = decoded.user_id;
      }
      if (!reviewerId) {
        this.snackBar.open('Reviewer ID not found', 'Close', { duration: 3000 });
        this.loading = false;
        return;
      }
      this.taskService.reviewTask(this.task.id, comment, true, reviewerId).subscribe(
        () => {
          this.snackBar.open('Task approved successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBar.open('Error approving task', 'Close', { duration: 3000 });
          this.loading = false;
        }
      );
    }
  }

  onReject(): void {
    if (this.reviewForm.valid) {
      this.loading = true;
      const comment = this.reviewForm.get('comment')?.value;
      
      const token = localStorage.getItem('token');
      let reviewerId: number | undefined = undefined;
      if (token) {
        const decoded: any = jwtDecode(token);
        reviewerId = decoded.user_id;
      }
      if (!reviewerId) {
        this.snackBar.open('Reviewer ID not found', 'Close', { duration: 3000 });
        this.loading = false;
        return;
      }
      this.taskService.reviewTask(this.task.id, comment, false, reviewerId).subscribe(
        () => {
          this.snackBar.open('Task rejected successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBar.open('Error rejecting task', 'Close', { duration: 3000 });
          this.loading = false;
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 