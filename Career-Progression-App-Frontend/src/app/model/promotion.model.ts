import { TaskCommentDTO } from './task-comment.model';
import { TaskStatus } from './task.model';

export enum PromotionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface PromotionRequest {
  id: number;
  message: string;
  status: PromotionStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  ai_report?: string;
}

export interface ActivePromotionRequestDTO {
  id: number;
  status: PromotionStatus;
  createdAt: string;
  updatedAt: string;
  message: string;
  user: UserDTO;
}

export interface PromotionRequestDetailsDTO {
  id: number;
  status: PromotionStatus;
  createdAt: string;
  updatedAt: string;
  message: string;
  user: UserDTO;
  tasks: TaskDTO[];
  taskComments: TaskCommentDTO[];
  aiReport: string;
}

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  profilePictureUrl?: string;
  role?: RoleDTO;
}

export interface RoleDTO {
  id: number;
  name: string;
}

export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  assignedToId: number;
  assignedToName: string;
  templateId: number;
  templateName: string;
  skillType: string;
  userPositions: string[];
}

export interface TaskTemplateDTO {
  id: number;
  name: string;
  skillType: string;
}
