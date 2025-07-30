import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../model/skill.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-manage-skills-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './manage-skills-dialog.component.html',
  styleUrl: './manage-skills-dialog.component.css',
})
export class ManageSkillsDialogComponent implements OnInit {
  skills: Skill[] = [];
  selectedSkills = new FormControl<number[]>([]);

  isLoading = true;
  isSaving = false;

  constructor(
    private dialogRef: MatDialogRef<ManageSkillsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private skillService: SkillService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.skillService.getAllSkills().subscribe({
      next: (skills) => {
        this.skills = skills;
        this.skillService.getUserSkills(this.data.userId).subscribe({
          next: (userSkills) => {
            const ids = userSkills.map((skill) => skill.id);
            this.selectedSkills.setValue(ids);
            this.isLoading = false;
          },
          error: () => (this.isLoading = false),
        });
      },
      error: () => (this.isLoading = false),
    });
  }

  save(): void {
    this.isSaving = true;
    const skillIds = this.selectedSkills.value || [];
    this.userService.updateUserSkills(this.data.userId, skillIds).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.isSaving = false),
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
