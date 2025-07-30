import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { PromotionRequestDetailsComponent } from './promotion-request-details.component';
import { PromotionService } from '../../services/promotion.service';
import { PromotionStatus } from '../../model/promotion.model';

describe('PromotionRequestDetailsComponent', () => {
  let component: PromotionRequestDetailsComponent;
  let fixture: ComponentFixture<PromotionRequestDetailsComponent>;
  let mockPromotionService: jasmine.SpyObj<PromotionService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const promotionServiceSpy = jasmine.createSpyObj('PromotionService', ['getPromotionRequestDetails']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PromotionRequestDetailsComponent],
      providers: [
        { provide: PromotionService, useValue: promotionServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    mockPromotionService = TestBed.inject(PromotionService) as jasmine.SpyObj<PromotionService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRequestDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load promotion request details on init', () => {
    const mockResponse = {
      success: true,
      data: {
        id: 1,
        status: PromotionStatus.PENDING,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        message: 'Test message',
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          active: true,
          role: { id: 1, name: 'Developer' }
        },
        tasks: [],
        taskComments: [],
        aiReport: 'Test analysis'
      },
      message: ''
    };

    mockPromotionService.getPromotionRequestDetails.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(mockPromotionService.getPromotionRequestDetails).toHaveBeenCalledWith(1);
    expect(component.promotionRequest).toEqual(mockResponse.data);
  });

  it('should navigate back to promotions list', () => {
    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/promotions']);
  });
}); 