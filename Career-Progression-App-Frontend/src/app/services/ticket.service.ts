import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TemplateDTO} from '../pages/templates/templates.component';
import { environment } from '../../environments/environment';
import { AIGenerationRequest, AIGenerationResponse } from '../components/ai-template-dialog/ai-template-dialog.component';

export interface SavedTicket {
  id: number;
  name: string;
  description: string;
  taskRequirements: string;

}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/template`;

  constructor(private httpClient: HttpClient) {}

  saveTemplate(ticket: TemplateDTO): Observable<TemplateDTO> {
    return this.httpClient.post<TemplateDTO>(this.apiUrl, ticket);
  }

  updateTicket(updatedTemplate: TemplateDTO): Observable<TemplateDTO> {
    return this.httpClient.put<TemplateDTO>(this.apiUrl, updatedTemplate);
  }

  getAllTemplates(): Observable<TemplateDTO[]> {
    return this.httpClient.get<TemplateDTO[]>(`${this.apiUrl}/all`);
  }

  getTicketById(id: number): Observable<TemplateDTO> {
    return this.httpClient.get<TemplateDTO>(`${this.apiUrl}/single/${id}`);
  }

  generateTemplateData(request: AIGenerationRequest): Observable<AIGenerationResponse> {
    return this.httpClient.post<AIGenerationResponse>(`${this.apiUrl}/generate-template-data`, request);
  }
}
