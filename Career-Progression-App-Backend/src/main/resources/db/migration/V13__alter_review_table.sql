ALTER TABLE Review 
ADD COLUMN reviewer_id INT NOT NULL;

ALTER TABLE Review
ADD CONSTRAINT fk_review_reviewer
FOREIGN KEY (reviewer_id) REFERENCES Users(id);