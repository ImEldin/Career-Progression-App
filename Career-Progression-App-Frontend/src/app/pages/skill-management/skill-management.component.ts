import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SkillService } from '../../services/skill.service';
import { Skill, Tag, SkillType, SkillDTO, TagDTO } from '../../model/skill.model';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { SelectionModel } from '@angular/cdk/collections';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SkillDialogComponent, SkillDialogData } from './skill-dialog/skill-dialog.component';
import { TagDialogComponent, TagDialogData } from './tag-dialog/tag-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-skill-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './skill-management.component.html',
  styleUrls: ['./skill-management.component.css']
})
export class SkillManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  skills: Skill[] = [];
  tags: Tag[] = [];
  skillTypes: SkillType[] = [];
  loading = false;
  error = '';

  skillsDataSource = new MatTableDataSource<Skill>();
  skillsDisplayedColumns = ['name', 'type', 'tags', 'actions'];
  skillsSelection = new SelectionModel<Skill>(false, []);

  tagsDataSource = new MatTableDataSource<Tag>();
  tagsDisplayedColumns = ['name', 'actions'];
  tagsSelection = new SelectionModel<Tag>(false, []);

  subskillFilter: string = '';

  constructor(
    private skillService: SkillService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      skills: this.skillService.getAllSkills(),
      tags: this.skillService.getAllTags(),
      types: this.skillService.getAllSkillTypes()
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.skills = (data.skills || []).map(skill => ({
            ...skill,
            type: skill.type || { id: 0, name: '-' },
            tags: Array.isArray(skill.tags) ? skill.tags.filter(Boolean) : []
          }));
          this.tags = (data.tags || []).filter(Boolean);
          this.skillTypes = (data.types || []).filter(Boolean);
          this.updateDataSources();
        },
        error: (err) => {
          this.error = 'Error loading data. Please try again.';
          this.snackBar.open(this.error, 'Close', { duration: 5000 });
        }
      });
  }

  updateDataSources(): void {
    let filteredSkills = this.skills;
    if (this.subskillFilter) {
      filteredSkills = filteredSkills.filter(skill =>
        (skill.tags || []).some(tag => tag.id === Number(this.subskillFilter))
      );
    }
    this.skillsDataSource.data = filteredSkills;
    this.skillsDataSource.sort = this.sort;

    this.tagsDataSource.data = this.tags;
    this.tagsDataSource.sort = this.sort;
  }

  applyFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  openSkillDialog(skill?: Skill): void {
    const dialogRef = this.dialog.open(SkillDialogComponent, {
      width: '500px',
      data: {
        skill,
        skillTypes: this.skillTypes,
        tags: this.tags
      } as SkillDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (skill) {
          this.updateSkill(skill.id, result);
        } else {
          this.createSkill(result);
        }
      }
    });
  }

  openTagDialog(tag?: Tag): void {
    const dialogRef = this.dialog.open(TagDialogComponent, {
      width: '400px',
      data: { tag } as TagDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (tag) {
          this.updateTag(tag.id, result);
        } else {
          this.createTag(result);
        }
      }
    });
  }

  createSkill(skillData: SkillDTO): void {
    this.skillService.createSkill(skillData).subscribe({
      next: (skill) => {
        skill.type = skill.type || { id: 0, name: '-' };
        skill.tags = Array.isArray(skill.tags) ? skill.tags.filter(Boolean) : [];
        this.skills.push(skill);
        this.updateDataSources();
        this.snackBar.open('Skill created successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Error creating skill', 'Close', { duration: 5000 });
      }
    });
  }

  updateSkill(id: number, skillData: SkillDTO): void {
    this.skillService.updateSkill(id, skillData).subscribe({
      next: (skill) => {
        skill.type = skill.type || { id: 0, name: '-' };
        skill.tags = Array.isArray(skill.tags) ? skill.tags.filter(Boolean) : [];
        const index = this.skills.findIndex(s => s.id === id);
        if (index !== -1) {
          this.skills[index] = skill;
          this.updateDataSources();
        }
        this.snackBar.open('Skill updated successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Error updating skill', 'Close', { duration: 5000 });
      }
    });
  }

  createTag(tagData: TagDTO): void {
    this.skillService.createTag(tagData).subscribe({
      next: (tag) => {
        this.tags.push(tag);
        this.updateDataSources();
        this.snackBar.open('Tag created successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Error creating tag', 'Close', { duration: 5000 });
      }
    });
  }

  updateTag(id: number, tagData: TagDTO): void {
    this.skillService.updateTag(id, tagData).subscribe({
      next: (tag) => {
        const index = this.tags.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tags[index] = tag;
          this.updateDataSources();
        }
        this.snackBar.open('Tag updated successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Error updating tag', 'Close', { duration: 5000 });
      }
    });
  }

  deleteSkill(skill: Skill): void {
    if (confirm(`Are you sure you want to delete ${skill.name}?`)) {
      this.skillService.deleteSkill(skill.id).subscribe({
        next: () => {
          this.skills = this.skills.filter(s => s.id !== skill.id);
          this.updateDataSources();
          this.snackBar.open('Skill deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Error deleting skill', 'Close', { duration: 5000 });
        }
      });
    }
  }

  deleteTag(tag: Tag): void {
    if (confirm(`Are you sure you want to delete ${tag.name}?`)) {
      this.skillService.deleteTag(tag.id).subscribe({
        next: () => {
          this.tags = this.tags.filter(t => t.id !== tag.id);
          this.updateDataSources();
          this.snackBar.open('Tag deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Error deleting tag', 'Close', { duration: 5000 });
        }
      });
    }
  }
} 