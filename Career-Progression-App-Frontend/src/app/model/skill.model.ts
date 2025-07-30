import { SkillTag } from './skill-tag.model';

export interface Skill {
  id: number;
  name: string;
  type: SkillType;
  tags: Tag[];
}

export interface SkillType {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface SkillDTO {
  id?: number;
  name: string;
  typeId?: number;
  tagIds: number[];
}

export interface TagDTO {
  id?: number;
  name: string;
}

export interface SkillTypeDTO {
  id?: number;
  name: string;
}
