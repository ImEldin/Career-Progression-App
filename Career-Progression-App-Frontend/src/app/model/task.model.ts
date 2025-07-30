export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
    assignedToId?: number;
    assignedToName?: string;
    templateId?: number;
    templateName?: string;
  }

  export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    DONE = 'DONE'
  }