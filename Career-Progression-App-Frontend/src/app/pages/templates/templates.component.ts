import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SkillService } from '../../services/skill.service';
import { Skill, SkillDTO } from '../../model/skill.model';
import { AITemplateDialogComponent, AIGenerationRequest, AIGenerationResponse } from '../../components/ai-template-dialog/ai-template-dialog.component';

interface Tag {
  name: string;
}

export interface TemplateDTO {
  id: number;
  name: string;
  description: string;
  requirements: string;
  skillIds: number[];
}

@Component({
  selector: 'app-ticket-template',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css'],
})
export class TemplatesComponent implements OnInit {
  templateForm: FormGroup;
  tags: Tag[] = [];
  isEditMode = false;
  currentTicketId: number | null = null;
  isSaving = false;
  showSuccessMessage = false;
  isGeneratingAI = false;

  skillCtrl = new FormControl('');
  allSkills: Skill[] = [];
  filteredSkills: Skill[] = [];
  selectedSkills: Skill[] = [];
  temporarySkills: { name: string; isNew: boolean }[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private skillService: SkillService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      taskRequirements: ['', Validators.required],
      levelRequirement: ['', Validators.required],
      newTag: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.currentTicketId = +params['id'];
        this.ticketService
          .getTicketById(this.currentTicketId)
          .subscribe((ticket) => {
            this.templateForm.patchValue({
              name: ticket.name,
              description: ticket.description,
              taskRequirements: ticket.requirements,
            });
          });
      }
    });

    this.skillService.getAllSkills().subscribe(skills => {
      this.allSkills = skills;
      this.filteredSkills = skills;
    });
  }

  openAIGenerationDialog(): void {
    const dialogRef = this.dialog.open(AITemplateDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: AIGenerationRequest | undefined) => {
      if (result) {
        this.generateAITemplate(result);
      }
    });
  }

  generateAITemplate(request: AIGenerationRequest): void {
    this.isGeneratingAI = true;
    
    this.ticketService.generateTemplateData(request).subscribe({
      next: (response: AIGenerationResponse) => {
        this.populateFormWithAIResponse(response);
        this.isGeneratingAI = false;
        this.snackBar.open('AI template generated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        console.error('Error generating AI template:', error);
        this.isGeneratingAI = false;
        this.snackBar.open('Failed to generate AI template. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  populateFormWithAIResponse(response: AIGenerationResponse): void {
    this.templateForm.patchValue({
      name: response.suggestedName,
      description: response.suggestedDescription,
      taskRequirements: response.suggestedRequirements
    });

    this.selectedSkills = [];
    this.temporarySkills = [];
    
    response.suggestedSkills.forEach(skillName => {
      const existingSkill = this.allSkills.find(skill => 
        skill.name.toLowerCase() === skillName.toLowerCase()
      );
      
      if (existingSkill) {
        this.selectedSkills.push(existingSkill);
      } else {
        this.temporarySkills.push({ name: skillName, isNew: true });
        this.selectedSkills.push({
          id: -this.temporarySkills.length,
          name: skillName,
          type: { id: 0, name: '-' },
          tags: []
        });
      }
    });
  }

  selectSkill(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
  
    if (value.startsWith('__create__')) {
      const skillName = value.replace('__create__', '');
      this.createSkill(skillName);
      return;
    }
  
    const skill = this.allSkills.find(s => s.name === value);
    if (skill && !this.selectedSkills.some(s => s.id === skill.id)) {
      this.selectedSkills.push(skill);
    }
    this.skillCtrl.setValue('');
  }  

  addSkillFromInput(event: any) {
  }

  removeSkill(skill: Skill) {
    this.selectedSkills = this.selectedSkills.filter(s => s.id !== skill.id);
    
    if (skill.id < 0) {
      const tempSkillIndex = Math.abs(skill.id) - 1;
      this.temporarySkills = this.temporarySkills.filter((_, index) => index !== tempSkillIndex);
      
      this.selectedSkills.forEach(selectedSkill => {
        if (selectedSkill.id < 0) {
          const tempSkill = this.temporarySkills.find((_, index) => 
            selectedSkill.name === this.temporarySkills[index]?.name
          );
          if (tempSkill) {
            const newIndex = this.temporarySkills.indexOf(tempSkill);
            selectedSkill.id = -(newIndex + 1);
          }
        }
      });
    }
  }

  get showCreateOptionSimple(): boolean {
    const value = this.skillCtrl.value ?? '';
    return !!value && !this.allSkills.some(skill => skill.name.toLowerCase() === value.toLowerCase());
  }

  createSkill(name: string) {
    const trimmedName = name.trim();
  
    if (!trimmedName) {
      console.warn('Skill name is empty.');
      return;
    }
  
    const alreadyExists = this.allSkills.some(
      skill => skill.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (alreadyExists) {
      console.warn('Skill already exists.');
      return;
    }
  
    const dto: SkillDTO = {
      name: trimmedName,
      typeId: undefined, 
      tagIds: []
    };
  
    this.skillService.createSkill(dto).subscribe(newSkill => {
      this.allSkills.push(newSkill);
      this.selectedSkills.push(newSkill);
      this.skillCtrl.setValue(''); 
    });
  }
  

  onSubmit(): void {
    this.isSaving = true;
    
    const saveTemporarySkills = () => {
      if (this.temporarySkills.length === 0) {
        saveTemplate();
        return;
      }
      
      let completedSkills = 0;
      const updatedSelectedSkills = [...this.selectedSkills];
      
      this.temporarySkills.forEach((tempSkill, index) => {
        const dto: SkillDTO = {
          name: tempSkill.name,
          typeId: undefined,
          tagIds: []
        };
        
        this.skillService.createSkill(dto).subscribe({
          next: (newSkill) => {
            const tempSkillIndex = updatedSelectedSkills.findIndex(s => s.id === -(index + 1));
            if (tempSkillIndex !== -1) {
              updatedSelectedSkills[tempSkillIndex] = newSkill;
            }
            
            completedSkills++;
            if (completedSkills === this.temporarySkills.length) {
              this.selectedSkills = updatedSelectedSkills;
              saveTemplate();
            }
          },
          error: (error) => {
            console.error('Error creating skill:', error);
            this.isSaving = false;
            this.snackBar.open('Error creating skills. Please try again.', 'Close', { duration: 5000 });
          }
        });
      });
    };
    
    const saveTemplate = () => {
      const skillIds = this.selectedSkills.map(s => s.id);
      const ticketData: TemplateDTO = {
        id: this.currentTicketId || -1,
        name: this.templateForm.value.name,
        description: this.templateForm.value.description,
        requirements: this.templateForm.value.taskRequirements,
        skillIds: skillIds
      };
      
      if (this.currentTicketId) {
        this.ticketService.updateTicket(ticketData).subscribe({
          next: (response) => {
            this.showSuccessMessage = true;
            this.isSaving = false;
            this.temporarySkills = [];
            this.selectedSkills = [];
            this.skillCtrl.setValue('');
            this.router.navigate(['/templates']);
          },
          error: (error) => {
            this.isSaving = false;
          },
        });
      } else {
        this.ticketService.saveTemplate(ticketData).subscribe({
          next: (response) => {
            this.showSuccessMessage = true;
            this.isSaving = false;
            this.temporarySkills = [];
            this.selectedSkills = [];
            this.skillCtrl.setValue('');
            this.router.navigate(['/templates']);
          },
          error: (error) => {
            this.isSaving = false;
          },
        });
      }
    };
    
    saveTemporarySkills();
  }

  onCancel(): void {
    this.templateForm.reset();
    this.tags = [];
    this.selectedSkills = [];
    this.temporarySkills = [];
    this.skillCtrl.setValue('');
    this.router.navigate(['/templates']);
  }
}
