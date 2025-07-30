import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTaskDialogComponent } from './review-task-dialog.component';

describe('ReviewTaskDialogComponent', () => {
  let component: ReviewTaskDialogComponent;
  let fixture: ComponentFixture<ReviewTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewTaskDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 