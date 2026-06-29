CREATE TABLE coaches (
  id         text PRIMARY KEY,
  first_name text NOT NULL,
  last_name  text NOT NULL,
  email      text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coaches_own_profile"
  ON coaches FOR ALL
  USING (auth.uid()::text = id);