import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTeamDialogComponentComponent } from './edit-team-dialog-component.component';

describe('EditTeamDialogComponentComponent', () => {
  let component: EditTeamDialogComponentComponent;
  let fixture: ComponentFixture<EditTeamDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTeamDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTeamDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
