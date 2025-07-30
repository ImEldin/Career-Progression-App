import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { BaseSubscriptionComponent } from '../../model/base-subscription.component'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [GoogleSigninButtonModule, CommonModule],
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent extends BaseSubscriptionComponent implements OnInit {
  errorMessage = '';
  isLoading = false;
  infoMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    super(); 
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) this.redirectToDashboard();

    this.addSubscription(
        this.authService.authStatusChanged.subscribe(isLoggedIn => {
            if (isLoggedIn) this.ngZone.run(() => this.redirectToDashboard());
        })
    );

    this.addSubscription(
        this.authService.pendingApproval.subscribe(message => {
            this.isLoading = false;
            this.infoMessage = message || 'Your account is pending approval from an administrator.';
        })
    );

    this.addSubscription(
        this.authService.inactiveUser.subscribe(message => {
            this.isLoading = false;
            this.infoMessage = message || 'Your profile is not activated yet.';
        })
    );
}


  private redirectToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  handleLoginError(error: any): void {
    this.errorMessage = error?.error?.message || 'Failed to sign in with Google. Please try again.';
    this.isLoading = false;
  }
}
