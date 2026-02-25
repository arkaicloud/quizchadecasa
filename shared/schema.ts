import { pgTable, text, uuid, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const gameRooms = pgTable("game_rooms", {
  id: text("id").primaryKey().default(sql`substr(md5(random()::text), 1, 3)`),
  grid: jsonb("grid").notNull(),
  placedWords: jsonb("placed_words").notNull(),
  words: text("words").array().notNull(),
  status: text("status").notNull().default("waiting"),
  winnerName: text("winner_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  adminPlayerId: uuid("admin_player_id"),
  theme: text("theme").notNull().default("familia"),
  roundNumber: integer("round_number").notNull().default(1),
});

export const gamePlayers = pgTable("game_players", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: text("room_id").notNull().references(() => gameRooms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  wordsFound: text("words_found").array().notNull().default(sql`'{}'`),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const gameRankings = pgTable("game_rankings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: text("room_id").notNull().references(() => gameRooms.id, { onDelete: "cascade" }),
  playerName: text("player_name").notNull(),
  wins: integer("wins").notNull().default(0),
});

export const unscrambleRooms = pgTable("unscramble_rooms", {
  id: text("id").primaryKey().default(sql`substr(md5(random()::text), 1, 3)`),
  words: jsonb("words").notNull(),
  status: text("status").notNull().default("waiting"),
  winnerName: text("winner_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  adminPlayerId: uuid("admin_player_id"),
});

export const unscramblePlayers = pgTable("unscramble_players", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: text("room_id").notNull().references(() => unscrambleRooms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  wordsGuessed: text("words_guessed").array().notNull().default(sql`'{}'`),
  score: integer("score").notNull().default(0),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type InsertGameRoom = typeof gameRooms.$inferInsert;
export type InsertGamePlayer = typeof gamePlayers.$inferInsert;
export type GameRoom = typeof gameRooms.$inferSelect;
export type GamePlayer = typeof gamePlayers.$inferSelect;

export type InsertGameRanking = typeof gameRankings.$inferInsert;
export type GameRanking = typeof gameRankings.$inferSelect;

export type InsertUnscrambleRoom = typeof unscrambleRooms.$inferInsert;
export type InsertUnscramblePlayer = typeof unscramblePlayers.$inferInsert;
export type UnscrambleRoom = typeof unscrambleRooms.$inferSelect;
export type UnscramblePlayer = typeof unscramblePlayers.$inferSelect;
