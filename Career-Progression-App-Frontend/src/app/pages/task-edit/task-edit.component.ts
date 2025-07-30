import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TemplateService, TemplateDTO } from '../../services/template.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css'],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatSelectModule, 
    MatOptionModule, 
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class TaskEditComponent implements OnInit {
  taskForm: FormGroup;
  templates: TemplateDTO[] = [];
  taskId: number | null = null;
  loading = true;
  taskTitle: string = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private templateService: TemplateService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      templateId: [null, Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
    
    this.route.queryParams.subscribe(params => {
      if (params['taskId']) {
        this.taskId = +params['taskId'];
        this.loadTask();
      } else {
        this.router.navigate(['/tasks']);
      }
    });
  }

  loadTemplates(): void {
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.snackBar.open('Error loading templates', 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        this.taskTitle = task.title;
        this.taskForm.patchValue({
          templateId: task.templateId,
          description: task.description
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.snackBar.open('Error loading task', 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid && this.taskId) {
      const payload = {
        templateId: this.taskForm.get('templateId')?.value,
        description: this.taskForm.get('description')?.value
      };

      this.taskService.updateTask(this.taskId, payload).subscribe({
        next: (response) => {
          this.snackBar.open('Task updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          let errorMessage = typeof error === 'string' ? error : 'Unknown error occurred';
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  get templateId() { return this.taskForm.get('templateId'); }
  get description() { return this.taskForm.get('description'); }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
} 