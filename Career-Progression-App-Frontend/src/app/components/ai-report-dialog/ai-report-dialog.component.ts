import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ai-report-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './ai-report-dialog.component.html',
  styleUrl: './ai-report-dialog.component.css',
})
export class AIReportDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { report: string },
    public dialogRef: MatDialogRef<AIReportDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  sanitizeBold(text: string): string {
    return text.replace(/\*\*/g, '');
  }
}
