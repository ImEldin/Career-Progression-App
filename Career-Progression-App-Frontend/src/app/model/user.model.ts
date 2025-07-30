import { Skill } from './skill.model';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string | null;
  active: boolean;
  profilePictureUrl: string;
  teamNames: string[];
  skills: Skill[];
}
