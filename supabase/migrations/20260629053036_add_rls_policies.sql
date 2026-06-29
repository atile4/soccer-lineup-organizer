ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coaches_own_teams"
  ON teams FOR ALL
  USING (auth.uid()::text = user_id);

CREATE POLICY "coaches_own_players"
  ON players FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = players.team_id
        AND auth.uid()::text = teams.user_id
    )
  );