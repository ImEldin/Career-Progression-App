import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../model/user.model';
import { Position } from '../../model/position.model';
import { Skill } from '../../model/skill.model';
import { Team } from '../../model/team.model';
import { UserService } from '../../services/user.service';
import { PositionService } from '../../services/position.service';
import { SkillService } from '../../services/skill.service';
import { UserPositionService } from '../../services/user-position.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TeamMembershipService } from '../../services/team-membership.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  userPositions: { [key: number]: Position } = {};
  userSkills: { [key: number]: Skill[] } = {};
  userTeams: { [key: number]: Team[] } = {};

  nameFilter: string = '';
  surnameFilter: string = '';
  positionFilter: string = '';
  skillFilter: string = '';
  teamFilter: string = '';
  noUsersMessage: string = '';

  allPositions: Position[] = [];
  allSkills: Skill[] = [];
  allTeams: Team[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private positionService: PositionService,
    private skillService: SkillService,
    private userPositionService: UserPositionService,
    private teamMembershipService: TeamMembershipService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadData();
  }

  loadData(): void {
    forkJoin([
      this.userService.getAllUsers(),
      this.positionService.getAllPositions(),
      this.skillService.getAllSkills(),
      this.teamMembershipService.getAllTeams(),
    ]).subscribe({
      next: ([users, positions, skills, teams]) => {
        this.users = users;
        this.allPositions = positions;
        this.allSkills = skills;
        this.allTeams = teams;

        this.loadUserPositionsAndSkills();
        this.applyFilters();
        this.changeDetectorRef.markForCheck();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.allSkills = [];
        this.allPositions = [];
        this.allTeams = [];
      },
    });
  }

  loadUserPositionsAndSkills(): void {
    this.users.forEach((user) => {
      this.userPositionService
        .getUserPositions(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((positions) => {
          if (positions.length > 0) {
            this.positionService
              .getPositionById(positions[0].positionId)
              .pipe(takeUntil(this.destroy$))
              .subscribe((position) => {
                this.userPositions[user.id] = position;
                this.changeDetectorRef.markForCheck();
              });
          }
        });

      this.skillService
        .getUserSkills(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((skills: Skill[]) => {
          this.userSkills[user.id] = skills;
          this.changeDetectorRef.markForCheck();
        });

      this.loadUserTeams(user.id);
    });
  }

  loadUserTeams(userId: number): void {
    this.teamMembershipService
      .getTeamsForUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (teams) => {
          this.userTeams[userId] = teams;
          this.changeDetectorRef.markForCheck();
        },
        error: (err) => {
          console.error('Error loading teams:', err);
          this.userTeams[userId] = [];
        },
      });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter((user) => {
      const nameMatch =
        !this.nameFilter ||
        user.firstName
          .toLowerCase()
          .includes(this.nameFilter.toLowerCase().trim());

      const surnameMatch =
        !this.surnameFilter ||
        user.lastName
          ?.toLowerCase()
          .includes(this.surnameFilter.toLowerCase().trim());

      const positionMatch =
        !this.positionFilter ||
        this.userPositions[user.id]?.id === Number(this.positionFilter);

      const skillMatch =
        !this.skillFilter ||
        (this.userSkills[user.id]?.some(
          (skill) => skill.id === Number(this.skillFilter)
        ) ??
          false);

      const teamMatch =
        !this.teamFilter ||
        (this.userTeams[user.id]?.some(
          (team) => team.id === Number(this.teamFilter)
        ) ??
          false);

      return (
        nameMatch && surnameMatch && positionMatch && skillMatch && teamMatch
      );
    });

    if (this.skillFilter && this.filteredUsers.length === 0) {
      const selectedSkill = this.allSkills.find(
        (skill) => skill.id === Number(this.skillFilter)
      );
      this.noUsersMessage = `No users found with skill: ${
        selectedSkill?.name || 'selected skill'
      }. Showing users with similar skills:`;
      this.findSimilarSkills(Number(this.skillFilter));
    } else {
      this.noUsersMessage = '';
    }
  }

  findSimilarSkills(skillId: number): void {
    this.skillService.findSimilarSkills(skillId).subscribe({
      next: (usersWithSkills: any[]) => {
        const similarUserIds = usersWithSkills.map((u) => u.user.id);
        this.filteredUsers = this.users.filter((user) =>
          similarUserIds.includes(user.id)
        );
        this.changeDetectorRef.markForCheck();
      },
      error: (err) => {
        console.error('Error finding similar skills:', err);
      },
    });
  }

  getUserPosition(userId: number): Position | undefined {
    return this.userPositions[userId];
  }

  getUserSkills(userId: number): Skill[] {
    return this.userSkills[userId] || [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToUserProfile(userId: number): void {
    this.router.navigate(['/user-profile', userId]);
  }
}
