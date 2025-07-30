import { User } from './user.model';

export interface Team {
  id: number;
  name: string;
  leadId: number;
  leadName: string;
  members: User[];
  uniqueSkillCount?: number;
}
