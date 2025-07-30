import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleEditComponent } from './admin-role-edit.component';

describe('AdminRoleEditComponent', () => {
  let component: AdminRoleEditComponent;
  let fixture: ComponentFixture<AdminRoleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoleEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
