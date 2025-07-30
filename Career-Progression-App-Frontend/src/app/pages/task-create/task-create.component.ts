import { Component, OnInit } from '@angular/core';
import { TaskService, PositionDTO, UserDTO, CreateTaskDTO } from '../../services/task.service';
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
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'create-ticket',
  standalone: true,
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
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
export class TaskCreateComponent implements OnInit {
  templates: TemplateDTO[] = [];
  positions: PositionDTO[] = [];
  teams: string[] = [];
  allUsers: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];
  selectedUsers: UserDTO[] = [];
  loadingUsers: boolean = false;

  taskForm: FormGroup;
  filterForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private templateService: TemplateService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      templateId: [null, Validators.required],
      description: ['', Validators.required],
      userIds: [[], Validators.required]
    });

    this.filterForm = this.fb.group({
      teamName: [null],
      positionIds: [[]],
      userSearch: ['']
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
    this.loadPositions();
    this.loadTeams();
    this.loadAllUsers();

    this.filterForm.get('teamName')?.valueChanges.subscribe(() => this.onTeamChange());
    this.filterForm.get('positionIds')?.valueChanges.subscribe(() => this.onPositionChange());
    this.filterForm.get('userSearch')?.valueChanges.subscribe(() => this.onUserSearch());
  }

  loadTemplates() {
    this.templateService.getTemplates().subscribe({
      next: templates => this.templates = templates,
      error: err => alert('Error loading templates: ' + err.message)
    });
  }

  loadPositions() {
    this.taskService.getPositions().subscribe({
      next: positions => this.positions = positions,
      error: err => alert('Error loading positions: ' + err.message)
    });
  }

  loadTeams() {
    this.taskService.getTeams().subscribe({
      next: teams => this.teams = teams,
      error: err => alert('Error loading teams: ' + err.message)
    });
  }

  loadAllUsers() {
    this.loadingUsers = true;
    this.taskService.getUsers().subscribe({
      next: users => {
        this.allUsers = users;
        this.filteredUsers = users;
        this.loadingUsers = false;
      },
      error: err => {
        alert('Error loading users: ' + err.message);
        this.loadingUsers = false;
      }
    });
  }

  onPositionChange() {
    const positionIds = this.filterForm.get('positionIds')?.value || [];
    if (positionIds.length === 0) {
      this.filteredUsers = this.allUsers;
      return;
    }

    this.loadingUsers = true;
    this.taskService.getUsersByPositions(positionIds).subscribe({
      next: users => {
        this.filteredUsers = users;
        this.loadingUsers = false;
      },
      error: err => {
        alert('Error loading users: ' + err.message);
        this.loadingUsers = false;
      }
    });
  }

  onTeamChange() {
    const teamName = this.filterForm.get('teamName')?.value;
    if (!teamName) {
      this.filteredUsers = this.allUsers;
      return;
    }

    this.loadingUsers = true;
    this.filteredUsers = this.allUsers.filter(user => user.teamNames.includes(teamName));
    this.loadingUsers = false;
  }

  onUserSearch() {
    const query = this.filterForm.get('userSearch')?.value?.toLowerCase() || '';
    if (!query.trim()) {
      this.filteredUsers = this.allUsers;
      return;
    }

    this.filteredUsers = this.allUsers.filter(user => {
      const firstName = user.firstName?.toLowerCase() || '';
      const lastName = user.lastName?.toLowerCase() || '';
      return firstName.includes(query) || lastName.includes(query);
    });
  }

  addUser(user: UserDTO) {
    if (!this.selectedUsers.find(u => u.id === user.id)) {
      this.selectedUsers = [...this.selectedUsers, user];
      this.taskForm.patchValue({
        userIds: this.selectedUsers.map(u => u.id)
      });
    }
  }

  removeUser(user: UserDTO) {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    this.taskForm.patchValue({
      userIds: this.selectedUsers.map(u => u.id)
    });
  }

  isUserSelected(user: UserDTO): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const payload: CreateTaskDTO = {
        title: this.taskForm.get('title')?.value,
        templateId: this.taskForm.get('templateId')?.value,
        description: this.taskForm.get('description')?.value,
        userIds: this.selectedUsers.map(u => u.id)
      };

      this.taskService.createTask(payload).subscribe({
        next: (response) => {
          this.snackBar.open('Task created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
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

  goToNewTemplate() {
    this.router.navigate(['/template']);
  }

  resetForm() {
    this.taskForm.reset();
    this.filterForm.reset();
    this.selectedUsers = [];
    this.filteredUsers = this.allUsers;
  }

  get title() { return this.taskForm.get('title'); }
  get templateId() { return this.taskForm.get('templateId'); }
  get description() { return this.taskForm.get('description'); }
  get userIds() { return this.taskForm.get('userIds'); }
}
