import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface AIGenerationRequest {
  keywords: string;
}

export interface AIGenerationResponse {
  suggestedName: string;
  suggestedDescription: string;
  suggestedRequirements: string;
  suggestedSkills: string[];
}

@Component({
  selector: 'app-ai-template-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ai-template-dialog.component.html',
  styleUrls: ['./ai-template-dialog.component.css']
})
export class AITemplateDialogComponent {
  aiForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AITemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.aiForm = this.fb.group({
      keywords: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onGenerate(): void {
    if (this.aiForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const request: AIGenerationRequest = {
        keywords: this.aiForm.get('keywords')?.value
      };

      this.dialogRef.close(request);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get keywords() {
    return this.aiForm.get('keywords');
  }
} 