import { TaskStatus } from '../model/task.model';

export function getStatusIcon(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'assignment';
    case TaskStatus.IN_PROGRESS:
      return 'trending_up';
    case TaskStatus.IN_REVIEW:
      return 'rate_review';
    case TaskStatus.DONE:
      return 'check_circle';
    default:
      return 'help';
  }
}

export function formatTaskStatus(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'To Do';
    case TaskStatus.IN_PROGRESS:
      return 'In Progress';
    case TaskStatus.IN_REVIEW:
      return 'In Review';
    case TaskStatus.DONE:
      return 'Done';
    default:
      return status;
  }
} 