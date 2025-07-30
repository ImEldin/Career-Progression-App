import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSkillsDialogComponent } from './manage-skills-dialog.component';

describe('ManageSkillsDialogComponent', () => {
  let component: ManageSkillsDialogComponent;
  let fixture: ComponentFixture<ManageSkillsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSkillsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSkillsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
