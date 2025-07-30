import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiReportDialogComponent } from './ai-report-dialog.component';

describe('AiReportDialogComponent', () => {
  let component: AiReportDialogComponent;
  let fixture: ComponentFixture<AiReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiReportDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
