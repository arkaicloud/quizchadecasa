# Caça-Palavras (Word Search) - Multiplayer Game

## Overview
A real-time multiplayer word search game where players create or join rooms, compete to find hidden words in a grid, and see each other's progress. Originally built with Lovable/Supabase, migrated to Replit's fullstack JS template.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite (in `client/`)
- **Backend**: Express server with API routes (in `server/`)
- **Database**: PostgreSQL with Drizzle ORM
- **Shared types**: Drizzle schema in `shared/schema.ts`
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: wouter (frontend)
- **Realtime**: Polling (replaced Supabase realtime subscriptions)

## Project Structure
```
client/                 # Frontend
  src/
    components/         # React components (Lobby, WaitingRoom, MultiplayerGame, WordGrid, WordList, GameTimer)
    pages/              # Page components (Index, NotFound)
    lib/                # Utilities (api.ts, wordSearchGenerator.ts, utils.ts)
    hooks/              # Custom hooks (use-toast, use-mobile)
  index.html            # HTML entry point
  index.css             # Global styles with CSS custom properties
server/                 # Backend
  index.ts              # Express server entry point
  routes.ts             # API route handlers
  storage.ts            # Database storage interface
  db.ts                 # Drizzle database connection
  vite.ts               # Vite dev server middleware
shared/                 # Shared code
  schema.ts             # Drizzle ORM schema (game_rooms, game_players)
```

## Database Schema
- **game_rooms**: id (text), grid (jsonb), placed_words (jsonb), words (text[]), status (text), winner_name (text), admin_player_id (uuid)
- **game_players**: id (uuid), room_id (text FK), name (text), words_found (text[]), is_admin (boolean)

## API Endpoints
- `POST /api/rooms` - Create a game room
- `GET /api/rooms/:id` - Get room details
- `PATCH /api/rooms/:id` - Update room (status, winner)
- `POST /api/players` - Create a player
- `GET /api/rooms/:roomId/players` - List players in a room
- `PATCH /api/players/:id` - Update player (words found)

## Running
- `npm run dev` starts Express server on port 5000 with Vite middleware
- `npm run db:push` pushes schema changes to database

## Game Flow
1. **Lobby**: Player enters name, creates or joins a room
2. **Waiting Room**: Players wait, admin starts the game (polling every 1.5s)
3. **Playing**: 180s timer, drag-to-select words on 12x12 grid, scoreboard polls every 2s
4. **Game Over**: Shows winner with confetti animation and glowing name, or timeout result. "Ver Ranking" button shows final player ranking with medals. "Voltar ao Lobby" returns to main screen.
