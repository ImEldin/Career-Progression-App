import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Skill, SkillType, Tag } from '../../../model/skill.model';

export interface SkillDialogData {
  skill?: Skill;
  skillTypes: SkillType[];
  tags: Tag[];
}

@Component({
  selector: 'app-skill-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './skill-dialog.component.html',
  styleUrls: ['./skill-dialog.component.css']
})
export class SkillDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SkillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SkillDialogData
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      typeId: ['', Validators.required],
      tagIds: [[]]
    });
  }

  ngOnInit(): void {
    if (this.data.skill) {
      this.form.patchValue({
        name: this.data.skill.name,
        typeId: this.data.skill.type.id,
        tagIds: this.data.skill.tags.map(tag => tag.id)
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 