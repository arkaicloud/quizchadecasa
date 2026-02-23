import { pgTable, text, uuid, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const gameRooms = pgTable("game_rooms", {
  id: text("id").primaryKey().default(sql`substr(md5(random()::text), 1, 6)`),
  grid: jsonb("grid").notNull(),
  placedWords: jsonb("placed_words").notNull(),
  words: text("words").array().notNull(),
  status: text("status").notNull().default("waiting"),
  winnerName: text("winner_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  adminPlayerId: uuid("admin_player_id"),
});

export const gamePlayers = pgTable("game_players", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: text("room_id").notNull().references(() => gameRooms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  wordsFound: text("words_found").array().notNull().default(sql`'{}'`),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type InsertGameRoom = typeof gameRooms.$inferInsert;
export type InsertGamePlayer = typeof gamePlayers.$inferInsert;
export type GameRoom = typeof gameRooms.$inferSelect;
export type GamePlayer = typeof gamePlayers.$inferSelect;
