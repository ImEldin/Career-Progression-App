import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionService } from '../../services/position.service';
import { Position } from '../../model/position.model';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.css'],
  imports: [
    MatInputModule,
    MatIcon,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class PositionFormComponent implements OnInit {
  position: Position = { id: 0, name: '' };
  isEditMode: boolean = false;
  positionForm!: FormGroup;
  isSaving: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(
    private positionService: PositionService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadPositionIfEditMode();
  }

  private initializeForm(): void {
    this.positionForm = this.formBuilder.group({
      name: [this.position.name, Validators.required],
    });
  }

  private loadPositionIfEditMode(): void {
    const positionId = this.route.snapshot.queryParamMap.get('id');
    if (positionId) {
      this.isEditMode = true;
      this.loadPosition(Number(positionId));
    }
  }

  loadPosition(id: number): void {
    this.positionService.getPositionById(id).subscribe({
      next: (data) => {
        this.position = data;
        this.positionForm.patchValue({ name: data.name });
      },
      error: (err) => console.error('Failed to load position', err),
    });
  }

  savePosition(): void {
    if (this.positionForm.invalid) return;

    this.isSaving = true;

    const updatedPosition: Position = {
      ...this.position,
      name: this.positionForm.value.name,
    };

    const request = this.isEditMode
      ? this.positionService.updatePosition(this.position.id, updatedPosition)
      : this.positionService.createPosition(updatedPosition);

    request.subscribe({
      next: () => {
        this.showSuccessMessage = true;
        this.isSaving = false;
        this.router.navigate(['/positions']);
      },
      error: (err) => {
        console.error('Failed to save', err);
        this.isSaving = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/positions']);
  }
}