import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  imports: [CommonModule],
})
export class ToolbarComponent implements OnInit {
  profileImage: string = 'assets/profile-image.jpg';
  userName: string = '';
  userRole: string = '';
  unreadCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.notificationService.unreadCount$.subscribe((count) => {
      this.unreadCount = count;
      this.changeDetectorRef.detectChanges();
    });
  }

  private loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.setUserDisplayInfo(user);
    this.fetchUnreadNotifications(user.id);
    console.log('Decoded user:', this.authService.getUserInfo());
  }

  private setUserDisplayInfo(user: any): void {
    this.userName = user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.name || 'User';

    this.userRole = user.role;
    if (user.picture) {
      this.profileImage = user.picture;
    }
    this.changeDetectorRef.detectChanges();
  }

  private fetchUnreadNotifications(userId: number): void {
    this.notificationService.getUnreadCount(userId).subscribe(
      (response) => {
        if (response.success) {
          this.unreadCount = response.data;
        } else {
          console.error('Error fetching unread count:', response.message);
        }
      },
      (err) => {
        console.error('Error fetching unread count:', err.message || err);
      }
    );
  }

  toggleNotifications(): void {
    this.router.navigate(['/notification']);
  }

  logout(): void {
    this.authService.logout();
  }
}
