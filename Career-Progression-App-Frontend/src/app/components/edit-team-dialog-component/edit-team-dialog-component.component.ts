import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../model/user.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { Team } from '../../model/team.model';
import { TeamService } from '../../services/team.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-create-team-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-team-dialog-component.component.html',
  styleUrl: './edit-team-dialog-component.component.css',
})
export class EditTeamDialogComponent implements OnInit {
  @Input() team?: Team;

  allUsers: User[] = [];
  filteredUsers: User[] = [];

  selectedLeadId: number | null = null;
  selectedMemberIds: Set<number> = new Set();
  teamName: string = '';
  loading = true;

  filters = {
    name: '',
    email: '',
    role: '',
    team: '',
    skill: '',
    tag: '',
  };

  constructor(
    private dialogRef: MatDialogRef<EditTeamDialogComponent>,
    private userService: UserService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.filteredUsers = [...this.allUsers];

        if (this.team) {
          this.teamName = this.team.name;
          this.selectedLeadId = this.team.leadId;
          this.selectedMemberIds = new Set(
            this.team.members
              .filter((m) => m.id !== this.selectedLeadId)
              .map((m) => m.id)
          );
        }

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  toggleUser(userId: number): void {
    if (this.selectedLeadId === userId) {
      this.selectedLeadId = null;
      return;
    }

    if (this.selectedMemberIds.has(userId)) {
      this.selectedMemberIds.delete(userId);
      return;
    }

    if (!this.selectedLeadId) {
      this.selectedLeadId = userId;
      return;
    }

    if (userId !== this.selectedLeadId) {
      this.selectedMemberIds.add(userId);
    }
  }

  isMemberSelected(userId: number): boolean {
    return this.selectedMemberIds.has(userId);
  }

  applyFilters(): void {
    const queryName = this.filters.name.toLowerCase();
    const queryEmail = this.filters.email.toLowerCase();
    const queryRole = this.filters.role.toLowerCase();
    const queryTeam = this.filters.team.toLowerCase();
    const querySkill = this.filters.skill.toLowerCase();
    const queryTag = this.filters.tag.toLowerCase();

    this.filteredUsers = this.allUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email?.toLowerCase() ?? '';
      const role = user.roleName?.toLowerCase() ?? '';
      const teams = (user.teamNames || []).join(', ').toLowerCase();
      const skills = (user.skills || [])
        .map((s) => s.name)
        .join(', ')
        .toLowerCase();
      const tags = (user.skills || [])
        .flatMap((s) => s.tags || [])
        .map((tag) => tag.name)
        .join(', ')
        .toLowerCase();

      return (
        fullName.includes(queryName) &&
        email.includes(queryEmail) &&
        role.includes(queryRole) &&
        teams.includes(queryTeam) &&
        skills.includes(querySkill) &&
        tags.includes(queryTag)
      );
    });
  }

  get isCreateDisabled(): boolean {
    return !this.teamName || !this.selectedLeadId;
  }

  buildTooltip(user: any): string {
    const teamLine = user.teamNames?.length
      ? `Teams: ${user.teamNames.join(', ')}`
      : 'Teams: none';

    const skillLine = user.skills?.length
      ? `Skills: ${user.skills.map((s: any) => s.name).join(', ')}`
      : 'Skills: none';

    const tags = (user.skills || [])
      .flatMap((s: any) => s.tags || [])
      .map((tag: any) => tag.name);

    let tagLine = 'Tags: none';
    if (tags.length > 0) {
      tagLine = `Tags: ${tags[0]}`;
      for (let i = 1; i < tags.length; i++) {
        tagLine += `\n      ${tags[i]}`;
      }
    }

    return `${teamLine}\n${skillLine}\n${tagLine}`;
  }

  submit(): void {
    const leadUser = this.allUsers.find(
      (user) => user.id === this.selectedLeadId
    );

    const memberUsers = Array.from(this.selectedMemberIds)
      .map((id) => this.allUsers.find((user) => user.id === id))
      .filter((user): user is User => !!user);

    const teamPayload: Team = {
      id: 0,
      name: this.teamName,
      leadId: this.selectedLeadId!,
      leadName: leadUser ? `${leadUser.firstName} ${leadUser.lastName}` : '',
      members: memberUsers,
    };

    this.teamService.editTeam(this.team!.id, teamPayload).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
