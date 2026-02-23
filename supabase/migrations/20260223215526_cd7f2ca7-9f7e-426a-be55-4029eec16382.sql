
-- Rooms table
CREATE TABLE public.game_rooms (
  id TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 6),
  grid JSONB NOT NULL,
  placed_words JSONB NOT NULL,
  words TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, playing, finished
  winner_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  admin_player_id UUID
);

ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read rooms (public game)
CREATE POLICY "Anyone can read rooms" ON public.game_rooms FOR SELECT USING (true);
-- Allow anyone to insert rooms
CREATE POLICY "Anyone can insert rooms" ON public.game_rooms FOR INSERT WITH CHECK (true);
-- Allow anyone to update rooms
CREATE POLICY "Anyone can update rooms" ON public.game_rooms FOR UPDATE USING (true);

-- Players table
CREATE TABLE public.game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  words_found TEXT[] NOT NULL DEFAULT '{}',
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read players" ON public.game_players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert players" ON public.game_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.game_players FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_players;
