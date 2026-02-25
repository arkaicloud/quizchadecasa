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
      Lobby.tsx         # Word Search lobby with theme selection
      WaitingRoom.tsx   # Word Search waiting room (shows theme + round)
      MultiplayerGame.tsx  # Word Search gameplay (with continue/rankings)
      WordGrid.tsx      # Drag-to-select word grid
      WordList.tsx      # Word progress list
      GameTimer.tsx     # Countdown timer
      Confetti.tsx      # Victory confetti animation
      UnscrambleLobby.tsx      # Unscramble lobby
      UnscrambleWaitingRoom.tsx # Unscramble waiting room
      UnscrambleGame.tsx       # Unscramble gameplay
    pages/              # Page components (Index, NotFound)
    lib/                # Utilities
      api.ts            # API helper
      wordSearchGenerator.ts  # Grid generation algorithm
      wordThemes.ts     # Theme definitions (10 themes, 4 word sets each)
      utils.ts          # General utilities
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
  schema.ts             # Drizzle ORM schema (5 tables)
```

## Database Schema
- **game_rooms**: id (text), grid (jsonb), placed_words (jsonb), words (text[]), status (text), winner_name (text), admin_player_id (uuid), theme (text), round_number (integer)
- **game_players**: id (uuid), room_id (text FK), name (text), words_found (text[]), is_admin (boolean)
- **game_rankings**: id (uuid), room_id (text FK), player_name (text), wins (integer) — cumulative wins per player per room
- **unscramble_rooms**: id (text), words (jsonb), status (text), winner_name (text), admin_player_id (uuid)
- **unscramble_players**: id (uuid), room_id (text FK), name (text), words_guessed (text[]), score (integer), is_admin (boolean)

## API Endpoints
### Word Search
- `POST /api/rooms` - Create a game room (with theme)
- `GET /api/rooms/:id` - Get room details
- `PATCH /api/rooms/:id` - Update room (status, winner)
- `POST /api/rooms/:id/continue` - Continue to next round (records winner, resets players, generates new grid)
- `GET /api/rooms/:id/rankings` - Get cumulative rankings for room
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

## Word Search Themes
10 themes available, each with 4 sets of 7 words:
- Países, Cidades, Objetos, Animais, Alimentos, Esportes, Profissões, Cores, Família, Natureza

## Running
- `npm run dev` starts Express server on port 5000 with Vite middleware
- `npm run db:push` pushes schema changes to database

## Game Flows

### Main Menu
- Choose between Caça-Palavras and Desembaralha Palavras

### Caça-Palavras (Word Search)
1. **Lobby**: Player enters name, chooses theme from 10 categories, creates room (or joins existing room by code)
2. **Waiting Room**: Players wait, shows theme + round number, QR code for sharing, admin starts the game
3. **Playing**: 300s timer, drag-to-select words on 12x12 grid, scoreboard polls every 2s
4. **Game Over**: Confetti + winner, ranking with medals, cumulative room ranking
5. **Continue**: Admin clicks "Continuar" → new round with fresh words from same theme, all players return to waiting room. Rankings accumulate across rounds.
6. **Rejoin**: Players can rejoin same room code. Non-admin players auto-detect continue via polling.

### Desembaralha Palavras (Word Unscramble)
1. **Lobby**: Player enters name, creates or joins a room
2. **Waiting Room**: Players wait, QR code for sharing, admin starts
3. **Playing**: 300s timer, type guesses for scrambled words, skip/navigate between words
4. **Game Over**: Confetti + ranking with medals
