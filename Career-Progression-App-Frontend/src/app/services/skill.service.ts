import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill, SkillDTO, Tag, TagDTO, SkillType, SkillTypeDTO } from '../model/skill.model';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = `${environment.apiUrl}/skills`;

  constructor(private http: HttpClient) {}

  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }

  createSkill(skill: SkillDTO): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, skill);
  }

  updateSkill(id: number, skill: SkillDTO): Observable<Skill> {
    return this.http.put<Skill>(`${this.apiUrl}/${id}`, skill);
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`);
  }

  createTag(tag: TagDTO): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/tags`, tag);
  }

  updateTag(id: number, tag: TagDTO): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/tags/${id}`, tag);
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tags/${id}`);
  }

  getAllSkillTypes(): Observable<SkillType[]> {
    return this.http.get<SkillType[]>(`${this.apiUrl}/types`);
  }

  createSkillType(skillType: SkillTypeDTO): Observable<SkillType> {
    return this.http.post<SkillType>(`${this.apiUrl}/types`, skillType);
  }

  getSkillTags(skillId: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/${skillId}/tags`);
  }

  addTagToSkill(skillId: number, tagId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${skillId}/tags/${tagId}`, {});
  }

  removeTagFromSkill(skillId: number, tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${skillId}/tags/${tagId}`);
  }

  getUserSkills(userId: number): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/user/${userId}`);
  }

  findSimilarSkills(skillId: number): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/${skillId}/similar-users`);
  }
}