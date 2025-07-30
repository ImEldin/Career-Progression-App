export interface Notification {
  id: number;
  message: string;
  createdAt: string;
  read: boolean;
  title: string;
  type: NotificationType;
}

export enum NotificationType {
  TASK = 'TASK',
  COMMENT = 'COMMENT',
  PROMOTION = 'PROMOTION',
  MEETING = 'MEETING',
  MESSAGE = 'MESSAGE',
  ALERT = 'ALERT',
  REVIEW = 'REVIEW',
  ERROR = 'ERROR',
  FEEDBACK = 'FEEDBACK'
}

export enum NotificationFilter {
  ALL = 'ALL',
  UNREAD = 'UNREAD',
  TASK = 'TASK',
  COMMENT = 'COMMENT',
  PROMOTION = 'PROMOTION',
  MEETING = 'MEETING',
  MESSAGE = 'MESSAGE',
  ALERT = 'ALERT',
  REVIEW = 'REVIEW',
  ERROR = 'ERROR',
  FEEDBACK = 'FEEDBACK',
}
