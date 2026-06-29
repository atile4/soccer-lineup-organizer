CREATE TABLE teams (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text NOT NULL,
  name       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE players (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    uuid REFERENCES teams(id) ON DELETE CASCADE,
  name       text NOT NULL,
  number     int NOT NULL,
  position   text,
  created_at timestamptz DEFAULT now()
);