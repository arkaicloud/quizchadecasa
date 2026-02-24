# Jogos em Família - Multiplayer Game Platform

## Overview
A multiplayer game platform with two games: Caça-Palavras (Word Search) and Desembaralha Palavras (Word Unscramble). Players create or join rooms with short codes, compete in real-time via polling, and see rankings. Originally built for Caça-Palavras, expanded with a main menu and second game.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite (in `client/`)
- **Backend**: Express server with API routes (in `server/`)
- **Database**: PostgreSQL with Drizzle ORM
- **Shared types**: Drizzle schema in `shared/schema.ts`
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: wouter (frontend)
- **Realtime**: Polling (1.5s waiting room, 2s gameplay)
- **Colors**: #f4f1e8 background, #223150 text, #9b4819 primary/buttons

## Project Structure
```
client/                 # Frontend
  src/
    components/         # React components
      MainMenu.tsx      # Game selection menu
      Lobby.tsx         # Word Search lobby
      WaitingRoom.tsx   # Word Search waiting room
      MultiplayerGame.tsx  # Word Search gameplay
      WordGrid.tsx      # Drag-to-select word grid
      WordList.tsx      # Word progress list
      GameTimer.tsx     # Countdown timer
      Confetti.tsx      # Victory confetti animation
      UnscrambleLobby.tsx      # Unscramble lobby
      UnscrambleWaitingRoom.tsx # Unscramble waiting room
      UnscrambleGame.tsx       # Unscramble gameplay
    pages/              # Page components (Index, NotFound)
    lib/                # Utilities (api.ts, wordSearchGenerator.ts, utils.ts)
    hooks/              # Custom hooks (use-toast, use-mobile)
  index.html            # HTML entry point
  index.css             # Global styles with CSS custom properties
server/                 # Backend
  index.ts              # Express server entry point
  routes.ts             # API route handlers (word search + unscramble)
  storage.ts            # Database storage interface
  db.ts                 # Drizzle database connection
  vite.ts               # Vite dev server middleware
shared/                 # Shared code
  schema.ts             # Drizzle ORM schema (4 tables)
```

## Database Schema
- **game_rooms**: id (text), grid (jsonb), placed_words (jsonb), words (text[]), status (text), winner_name (text), admin_player_id (uuid)
- **game_players**: id (uuid), room_id (text FK), name (text), words_found (text[]), is_admin (boolean)
- **unscramble_rooms**: id (text), words (jsonb - array of {scrambled, original}), status (text), winner_name (text), admin_player_id (uuid)
- **unscramble_players**: id (uuid), room_id (text FK), name (text), words_guessed (text[]), score (integer), is_admin (boolean)

## API Endpoints
### Word Search
- `POST /api/rooms` - Create a game room
- `GET /api/rooms/:id` - Get room details
- `PATCH /api/rooms/:id` - Update room (status, winner)
- `POST /api/players` - Create a player
- `GET /api/rooms/:roomId/players` - List players in a room
- `PATCH /api/players/:id` - Update player (words found)

### Unscramble
- `POST /api/unscramble/rooms` - Create an unscramble room
- `GET /api/unscramble/rooms/:id` - Get room details
- `PATCH /api/unscramble/rooms/:id` - Update room
- `POST /api/unscramble/players` - Create a player
- `GET /api/unscramble/rooms/:roomId/players` - List players
- `PATCH /api/unscramble/players/:id` - Update player (words guessed, score)

## Running
- `npm run dev` starts Express server on port 5000 with Vite middleware
- `npm run db:push` pushes schema changes to database

## Game Flows

### Main Menu
- Choose between Caça-Palavras and Desembaralha Palavras

### Caça-Palavras (Word Search)
1. **Lobby**: Player enters name, creates or joins a room
2. **Waiting Room**: Players wait, QR code for sharing, admin starts the game
3. **Playing**: 300s timer, drag-to-select words on 12x12 grid, scoreboard polls every 2s
4. **Game Over**: Confetti + glowing winner name, ranking with medals

### Desembaralha Palavras (Word Unscramble)
1. **Lobby**: Player enters name, creates or joins a room
2. **Waiting Room**: Players wait, QR code for sharing, admin starts
3. **Playing**: 300s timer, type guesses for scrambled words, skip/navigate between words
4. **Game Over**: Confetti + ranking with medals
- Words: OEGACNOCH→ACONCHEGO, RLA→LAR, AFLIÍMA→FAMÍLIA, ÇRMOECEO→RECOMEÇO, DIÃOTARG→GRATIDÃO, ÇNÊBO→BÊNÇÃO, ÇRAEANPS→ESPERANÇA
