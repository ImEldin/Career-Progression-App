export interface GoogleLoginResponse {
    status: 'PENDING_APPROVAL' | 'INACTIVE_USER' | 'ACTIVE';
    message: string;
    data?: string;
  }
