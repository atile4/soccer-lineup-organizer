CREATE TABLE IF NOT EXISTS lineups (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id    uuid REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    period     smallint NOT NULL,
    formation  text,
    created_at timestamptz DEFAULT now(),
    UNIQUE (game_id, period)
);

ALTER TABLE lineups ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION owns_game(check_game_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM games g
    JOIN teams t ON t.id = g.team_id
    WHERE g.id = check_game_id AND t.user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Users can view own lineups" ON lineups
  FOR SELECT USING (owns_game(game_id));

CREATE POLICY "Users can insert own lineups" ON lineups
  FOR INSERT WITH CHECK (owns_game(game_id));

CREATE POLICY "Users can update own lineups" ON lineups
  FOR UPDATE USING (owns_game(game_id));

CREATE POLICY "Users can delete own lineups" ON lineups
  FOR DELETE USING (owns_game(game_id));