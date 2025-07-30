import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Team } from '../../model/team.model';
import { Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Skill } from '../../model/skill.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CreateTeamDialogComponent } from '../../components/create-team-dialog/create-team-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditTeamDialogComponent } from '../../components/edit-team-dialog-component/edit-team-dialog-component.component';

@Component({
  selector: 'app-teams',
  imports: [
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css',
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  filteredTeams: Team[] = [];

  filters = {
    teamName: '',
    userName: '',
    role: '',
    skill: '',
    tag: '',
  };

  loadingTeams = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private teamService: TeamService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.loadingTeams = true;
    this.teamService.getAllTeams().subscribe({
      next: (data) => {
        this.teams = data.map((team) => ({
          ...team,
          uniqueSkillCount: this.getUniqueSkillObjects(team).length,
        }));
        this.loadingTeams = false;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to load teams', err);
        this.loadingTeams = false;
      },
    });
  }

  goToUserProfile(userId: number): void {
    window.open(`/user-profile/${userId}`, '_blank');
  }

  getUniqueSkillObjects(team: Team): Skill[] {
    const map = new Map<string, Skill>();

    team.members.forEach((user) => {
      user.skills?.forEach((skill) => {
        if (skill.name && !map.has(skill.name)) {
          map.set(skill.name, skill);
        }
      });
    });

    return Array.from(map.values());
  }

  getSkillTooltip(skill: Skill): string {
    const type = skill.type?.name ?? 'Unknown type';

    const tags = skill.tags?.map((tag) => tag.name) || [];
    let tagLine = 'Tags: No tags';

    if (tags.length > 0) {
      tagLine = `Tags: ${tags[0]}`;
      for (let i = 1; i < tags.length; i++) {
        tagLine += `\n      ${tags[i]}`;
      }
    }

    return `Type: ${type}\n${tagLine}`;
  }

  applyFilters(): void {
    const teamNameFilter = this.filters.teamName.toLowerCase().trim();
    const userNameFilter = this.filters.userName.toLowerCase().trim();
    const roleFilter = this.filters.role.toLowerCase().trim();
    const skillFilter = this.filters.skill.toLowerCase().trim();
    const tagFilter = this.filters.tag.toLowerCase().trim();

    this.filteredTeams = this.teams.filter((team) => {
      const matchesTeamName =
        !teamNameFilter || team.name.toLowerCase().includes(teamNameFilter);

      const matchesMember = team.members.some((member) => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const role = member.roleName?.toLowerCase() ?? '';

        const skills = (member.skills || [])
          .map((s) => s.name?.toLowerCase())
          .filter((name): name is string => !!name);

        const tags = (member.skills || [])
          .flatMap((s) => s.tags || [])
          .map((t) => t.name?.toLowerCase())
          .filter((name): name is string => !!name);

        const skillMatch =
          !skillFilter || skills.some((skill) => skill.includes(skillFilter));
        const tagMatch =
          !tagFilter || tags.some((tag) => tag.includes(tagFilter));

        const userNameMatch =
          !userNameFilter || fullName.includes(userNameFilter);
        const roleMatch = !roleFilter || role.includes(roleFilter);

        return userNameMatch && roleMatch && skillMatch && tagMatch;
      });

      return matchesTeamName && matchesMember;
    });
  }

  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTeams();
      }
    });
  }

  openEditTeamDialog(teamId: number): void {
    const dialogRef = this.dialog.open(EditTeamDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog',
    });

    this.teamService.getTeamById(teamId).subscribe((team) => {
      dialogRef.componentInstance.team = team;
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTeams();
      }
    });
  }

  deleteTeam(teamId: number): void {
    this.teamService.deleteTeam(teamId).subscribe({
      next: () => {
        this.loadTeams();
      },
      error: (err) => {
        console.error('Failed to delete team', err);
      },
    });
  }
}
