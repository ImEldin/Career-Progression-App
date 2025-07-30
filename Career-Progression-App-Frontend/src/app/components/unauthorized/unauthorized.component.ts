import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <button (click)="goBack()">Go Back</button>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    h1 {
      color: #dc3545;
      margin-bottom: 1rem;
    }
    p {
      color: #666;
      margin-bottom: 2rem;
    }
    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/login']);
  }
} 