INSERT INTO Permission (name)
 VALUES
     ('MANAGE_TASK'),
     ('INTERACT_WITH_TASK'),
     ('MANAGE_TEMPLATE'),
     ('VIEW_TEAM_PROFILES'),
     ('VIEW_ALL_PROFILES'),
     ('COMMENT_ON_PROFILE'),
     ('REVIEW_EMPLOYEE'),
     ('APPROVE_PROMOTION'),
     ('MANAGE_ROLES'),
     ('MANAGE_PERMISSIONS'),
     ('MANAGE_USERS'),
     ('MANAGE_TEAMS'),
     ('MANAGE_POSITIONS'),
     ('MANAGE_REPORTS');

 -- MANAGE_TASK: Kreiranje, uređivanje, brisanje i dodjela taskova
 -- INTERACT_WITH_TASK: Komentarisanje i označavanje taskova kao završene
 -- MANAGE_TEMPLATE: Kreiranje, uređivanje i brisanje task template-a
 -- VIEW_TEAM_PROFILES: Pregled profila članova tima (Team Lead)
 -- VIEW_ALL_PROFILES: Pregled svih profila u firmi (Admin/Lead of Leads)
 -- COMMENT_ON_PROFILE: Ostavljanje komentara na profilima korisnika
 -- REVIEW_EMPLOYEE: Ocjenjivanje zaposlenih i pisanje review-a
 -- APPROVE_PROMOTION: Odobravanje promocija (CTO, Admin)
 -- MANAGE_ROLES: Kreiranje i uređivanje rola u sistemu
 -- MANAGE_PERMISSIONS: Dodjeljivanje i uklanjanje permisija roli
 -- MANAGE_USERS: Dodavanje, izmjena i deaktivacija korisnika
 -- MANAGE_TEAMS: Dodjeljivanje članova timovima i uređivanje timova
 -- MANAGE_POSITIONS: Dodavanje i upravljanje pozicijama i levelima
 -- MANAGE_REPORTS: Generisanje i upravljanje izvještajima