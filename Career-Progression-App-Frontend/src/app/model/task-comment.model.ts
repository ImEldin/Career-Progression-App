export interface TaskCommentDTO {
  id: number;
  message: string;
  createdAt: string;
  taskId: number;
  taskTitle: string;
  authorId: number;
  authorName: string;
} 