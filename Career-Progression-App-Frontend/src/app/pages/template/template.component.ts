import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { TemplateDTO } from '../templates/templates.component';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-template-view',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit {
  savedTemplates: TemplateDTO[] = [];
  isLoadingTemplates = false;

  constructor(
    private router: Router,
    private ticketService: TicketService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.isLoadingTemplates = true;
    this.ticketService.getAllTemplates().subscribe((templates) => {
      this.savedTemplates = templates;
      this.isLoadingTemplates = false;
    });
  }

  renderMarkdown(md: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      marked.parse(md || '') as string
    );
  }

  editTicket(ticketId: number): void {
    this.router.navigate(['/template'], {
      queryParams: { id: ticketId },
    });
  }

  createNewTicket(): void {
    this.router.navigate(['/template']);
  }
}
