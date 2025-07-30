CREATE TABLE PositionLevel (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    level INT NOT NULL,
    position_id INT NOT NULL REFERENCES Position(id),
    UNIQUE (level, position_id)
);

ALTER TABLE UserPosition
DROP COLUMN level;

ALTER TABLE UserPosition
ADD COLUMN position_level_id INT REFERENCES PositionLevel(id);