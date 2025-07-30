import { Team } from "./team.model";

export interface TeamMembership {
  id: number;
  userId: number;
  teamId: number;
  team: Team;
}