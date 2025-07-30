CREATE TABLE SkillType (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE Skill (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR NOT NULL,
  skill_type_id INT REFERENCES SkillType(id),
  UNIQUE(name, skill_type_id)
);

CREATE TABLE TemplateSkill (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  template_id INT REFERENCES TaskTemplate(id),
  skill_id INT REFERENCES Skill(id),
  level VARCHAR NOT NULL,
  UNIQUE(template_id, skill_id)
);

CREATE TABLE UserSkill (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT REFERENCES Users(id),
  skill_id INT REFERENCES Skill(id),
  level VARCHAR NOT NULL,
  UNIQUE(user_id, skill_id)
);