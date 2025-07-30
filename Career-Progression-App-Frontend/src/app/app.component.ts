import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    ToolbarComponent,
    NgIf,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'CareerProgressionApp';

  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkAuthStatus();

    this.authService.authStatusChanged.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
}
