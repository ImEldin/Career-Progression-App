INSERT INTO Users (first_name, last_name, email, role_id) VALUES
('Faris', 'Gogić', 'farisgogic1@gmail.com', 1),
('Eldin', 'Popara', 'popara.eldin@gmail.com', 1),
('Nermin', 'Obućina', 'nermin_obucina@hotmail.com', 1),
('Dino', 'Alić', 'dino.alic@stu.ssst.edu.ba', 1),
('Deni', 'Alić', 'deni.alic@stu.ssst.edu.ba', 1),
('Jasmin', 'Dudić', 'jasmin.dudic@bloomteq.com', 2),
('Elvir', 'Vlahovljak', 'elvir.vlahovljak@bloomteq.com', 2),
('Hani', 'Zahirović', 'hani@bloomteq.com', 4),
('Admin', 'Admin', 'admin@bloomteq.com', 5)
ON CONFLICT DO NOTHING;

INSERT INTO TaskTemplate (name, description, task_requirements) VALUES
('Task Template 1', 'Description for Task Template 1', 'Requirement 1, Requirement 2'),
('Task Template 2', 'Description for Task Template 2', 'Requirement 3, Requirement 4')
ON CONFLICT DO NOTHING;

INSERT INTO Task (title, description, status, created_at, updated_at, assigned_to, template_id) VALUES
('Task 1', 'Description of Task 1', 'Todo', NOW(), NOW(), 1, 1),
('Task 2', 'Description of Task 2', 'In Progress', NOW(), NOW(), 2, 2),
('Task 3', 'Description of Task 3', 'In Review', NOW(), NOW(), 3, 1),
('Task 4', 'Description of Task 4', 'In Review', NOW(), NOW(), 4, 1),
('Task 5', 'Description of Task 5', 'Todo', NOW(), NOW(), 5, 2),
('Task 6', 'Description of Task 6', 'In Review', NOW(), NOW(), 2, 1),
('Task 7', 'Description of Task 7', 'In Progress', NOW(), NOW(), 3, 1),
('Task 8', 'Description of Task 8', 'In Review', NOW(), NOW(), 1, 2)
ON CONFLICT DO NOTHING;

INSERT INTO TaskComment (message, created_at, updated_at, task_id, user_id, author_id) VALUES
('This is a comment on Task 1', NOW(), NOW(), 1, 1, 2),
('This is a comment on Task 2', NOW(), NOW(), 2, 2, 3)
ON CONFLICT DO NOTHING;

INSERT INTO Review (feedback, created_at, updated_at, user_id) VALUES
('Good performance', NOW(), NOW(), 1),
('Needs improvement', NOW(), NOW(), 2)
ON CONFLICT DO NOTHING;

INSERT INTO OnDemandReport (data, created_at, recipient_id) VALUES
('Report data for User 1', NOW(), 1),
('Report data for User 2', NOW(), 2)
ON CONFLICT DO NOTHING;

INSERT INTO notification (message, created_at, recipient_id, is_read, title, type) VALUES 
  ('John commented on your ticket: Please add tests.', NOW() - INTERVAL '6 days', 1, false, 'New Comment', 'COMMENT'),
  ('Team meeting scheduled for Monday at 10 AM.', NOW() - INTERVAL '7 days', 2, false, 'Meeting scheduled', 'MEETING'),
  ('You received a new message from HR.', NOW() - INTERVAL '8 days', 1, true, 'Message from HR', 'MESSAGE'),
  ('Your latest review is now available.', NOW() - INTERVAL '9 days', 3, false, 'Review ready', 'REVIEW'),
  ('New comment on your post: Looks good!', NOW() - INTERVAL '10 days', 3, false, 'Comment', 'COMMENT'),
  ('Promotion review scheduled for next week.', NOW() - INTERVAL '11 days', 2, false, 'Upcoming Review', 'REVIEW'),
  ('Reminder: Daily standup at 9 AM.', NOW() - INTERVAL '12 days', 1, true, 'Daily Meeting', 'MEETING'),
  ('You received a private message from your team lead.', NOW() - INTERVAL '13 days', 4, false, 'Message', 'MESSAGE'),
  ('Weekly feedback submitted successfully.', NOW() - INTERVAL '14 days', 5, true, 'Feedback Sent', 'FEEDBACK'),
  ('New task assigned: Prepare Q2 Report', NOW() - INTERVAL '15 days', 5, false, 'Task assigned', 'TASK'),
  ('Alert: Unusual login attempt detected.', NOW() - INTERVAL '16 days', 1, false, 'Security Alert', 'ALERT'),
  ('Error while processing payroll data.', NOW() - INTERVAL '17 days', 2, false, 'Critical Error', 'ERROR'),
  ('New review: All objectives met this quarter.', NOW() - INTERVAL '18 days', 1, true, 'Quarterly Review', 'REVIEW'),
  ('Manager left a comment on your ticket.', NOW() - INTERVAL '19 days', 3, false, 'Comment', 'COMMENT'),
  ('Meeting rescheduled: Friday 3 PM.', NOW() - INTERVAL '20 days', 4, false, 'Meeting Change', 'MEETING'),
  ('You''ve received a new promotion: Tech Lead.', NOW() - INTERVAL '21 days', 5, true, 'Congratulations', 'PROMOTION'),
  ('Message from CTO: Please review the roadmap.', NOW() - INTERVAL '22 days', 3, false, 'Message', 'MESSAGE'),
  ('Don''t forget to submit your monthly report.', NOW() - INTERVAL '23 days', 2, false, 'Reminder', 'ALERT'),
  ('Feedback: Improve response time to tickets.', NOW() - INTERVAL '24 days', 1, true, 'Performance Feedback', 'FEEDBACK'),
  ('Task overdue: Finalize UI components.', NOW() - INTERVAL '25 days', 1, false, 'Task overdue', 'TASK'),
  ('Unexpected error in analytics module.', NOW() - INTERVAL '26 days', 3, false, 'System Error', 'ERROR'),
  ('Your review was approved by upper management.', NOW() - INTERVAL '27 days', 4, true, 'Review Approved', 'REVIEW'),
  ('Comment from peer: Consider optimizing the code.', NOW() - INTERVAL '28 days', 2, false, 'Peer Feedback', 'COMMENT'),
  ('Upcoming meeting: Sprint Planning - Monday', NOW() - INTERVAL '29 days', 5, false, 'Planning Meeting', 'MEETING')
ON CONFLICT DO NOTHING;

INSERT INTO PromotionStatus (name) VALUES ('PENDING'), ('APPROVED'), ('REJECTED')
ON CONFLICT DO NOTHING;

INSERT INTO PromotionRequest (status, created_at, updated_at, user_id) VALUES
('PENDING', NOW(), NOW(), 1),
('APPROVED', NOW(), NOW(), 2)
ON CONFLICT DO NOTHING;

INSERT INTO Team (name, lead_id) VALUES
('Team 1', 6),
('Team 2', 7)
ON CONFLICT DO NOTHING;

INSERT INTO TeamMembership (user_id, team_id) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 2)
ON CONFLICT DO NOTHING;

INSERT INTO Position (name) VALUES
('AI Engineer'),
('Full Stack Developer'),
('Data Scientist'),
('Product Manager'),
('UX/UI Designer'),
('DevOps Engineer'),
('Cloud Architect'),
('Quality Assurance Engineer'),
('Mobile App Developer'),
('Business Analyst')
ON CONFLICT DO NOTHING;

INSERT INTO UserPosition (level, user_id, position_id) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(2, 4, 4),
(3, 5, 5)
ON CONFLICT DO NOTHING;

INSERT INTO ReportSnapshot (created_at, report_data) VALUES
(NOW(), 'Snapshot data for report 1'),
(NOW(), 'Snapshot data for report 2')
ON CONFLICT DO NOTHING;