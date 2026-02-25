import { eq, and } from "drizzle-orm";
import { db } from "./db";
import {
  gameRooms, gamePlayers, gameRankings,
  unscrambleRooms, unscramblePlayers,
  type InsertGameRoom, type InsertGamePlayer, type GameRoom, type GamePlayer,
  type InsertGameRanking, type GameRanking,
  type InsertUnscrambleRoom, type InsertUnscramblePlayer, type UnscrambleRoom, type UnscramblePlayer,
} from "@shared/schema";

export interface IStorage {
  createRoom(room: InsertGameRoom): Promise<GameRoom>;
  getRoom(id: string): Promise<GameRoom | undefined>;
  updateRoom(id: string, data: Partial<GameRoom>): Promise<GameRoom | undefined>;
  createPlayer(player: InsertGamePlayer): Promise<GamePlayer>;
  getPlayersByRoom(roomId: string): Promise<GamePlayer[]>;
  getPlayer(id: string): Promise<GamePlayer | undefined>;
  updatePlayer(id: string, data: Partial<GamePlayer>): Promise<GamePlayer | undefined>;
  resetPlayersForRoom(roomId: string): Promise<void>;

  getRankingsByRoom(roomId: string): Promise<GameRanking[]>;
  upsertRanking(roomId: string, playerName: string): Promise<GameRanking>;

  createUnscrambleRoom(room: InsertUnscrambleRoom): Promise<UnscrambleRoom>;
  getUnscrambleRoom(id: string): Promise<UnscrambleRoom | undefined>;
  updateUnscrambleRoom(id: string, data: Partial<UnscrambleRoom>): Promise<UnscrambleRoom | undefined>;
  createUnscramblePlayer(player: InsertUnscramblePlayer): Promise<UnscramblePlayer>;
  getUnscramblePlayersByRoom(roomId: string): Promise<UnscramblePlayer[]>;
  getUnscramblePlayer(id: string): Promise<UnscramblePlayer | undefined>;
  updateUnscramblePlayer(id: string, data: Partial<UnscramblePlayer>): Promise<UnscramblePlayer | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createRoom(room: InsertGameRoom): Promise<GameRoom> {
    const [created] = await db.insert(gameRooms).values(room).returning();
    return created;
  }

  async getRoom(id: string): Promise<GameRoom | undefined> {
    const [room] = await db.select().from(gameRooms).where(eq(gameRooms.id, id));
    return room;
  }

  async updateRoom(id: string, data: Partial<GameRoom>): Promise<GameRoom | undefined> {
    const [updated] = await db.update(gameRooms).set(data).where(eq(gameRooms.id, id)).returning();
    return updated;
  }

  async createPlayer(player: InsertGamePlayer): Promise<GamePlayer> {
    const [created] = await db.insert(gamePlayers).values(player).returning();
    return created;
  }

  async getPlayersByRoom(roomId: string): Promise<GamePlayer[]> {
    return db.select().from(gamePlayers).where(eq(gamePlayers.roomId, roomId));
  }

  async getPlayer(id: string): Promise<GamePlayer | undefined> {
    const [player] = await db.select().from(gamePlayers).where(eq(gamePlayers.id, id));
    return player;
  }

  async updatePlayer(id: string, data: Partial<GamePlayer>): Promise<GamePlayer | undefined> {
    const [updated] = await db.update(gamePlayers).set(data).where(eq(gamePlayers.id, id)).returning();
    return updated;
  }

  async resetPlayersForRoom(roomId: string): Promise<void> {
    await db.update(gamePlayers).set({ wordsFound: [] }).where(eq(gamePlayers.roomId, roomId));
  }

  async getRankingsByRoom(roomId: string): Promise<GameRanking[]> {
    return db.select().from(gameRankings).where(eq(gameRankings.roomId, roomId));
  }

  async upsertRanking(roomId: string, playerName: string): Promise<GameRanking> {
    const [existing] = await db.select().from(gameRankings)
      .where(and(eq(gameRankings.roomId, roomId), eq(gameRankings.playerName, playerName)));

    if (existing) {
      const [updated] = await db.update(gameRankings)
        .set({ wins: existing.wins + 1 })
        .where(eq(gameRankings.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(gameRankings)
      .values({ roomId, playerName, wins: 1 })
      .returning();
    return created;
  }

  async createUnscrambleRoom(room: InsertUnscrambleRoom): Promise<UnscrambleRoom> {
    const [created] = await db.insert(unscrambleRooms).values(room).returning();
    return created;
  }

  async getUnscrambleRoom(id: string): Promise<UnscrambleRoom | undefined> {
    const [room] = await db.select().from(unscrambleRooms).where(eq(unscrambleRooms.id, id));
    return room;
  }

  async updateUnscrambleRoom(id: string, data: Partial<UnscrambleRoom>): Promise<UnscrambleRoom | undefined> {
    const [updated] = await db.update(unscrambleRooms).set(data).where(eq(unscrambleRooms.id, id)).returning();
    return updated;
  }

  async createUnscramblePlayer(player: InsertUnscramblePlayer): Promise<UnscramblePlayer> {
    const [created] = await db.insert(unscramblePlayers).values(player).returning();
    return created;
  }

  async getUnscramblePlayersByRoom(roomId: string): Promise<UnscramblePlayer[]> {
    return db.select().from(unscramblePlayers).where(eq(unscramblePlayers.roomId, roomId));
  }

  async getUnscramblePlayer(id: string): Promise<UnscramblePlayer | undefined> {
    const [player] = await db.select().from(unscramblePlayers).where(eq(unscramblePlayers.id, id));
    return player;
  }

  async updateUnscramblePlayer(id: string, data: Partial<UnscramblePlayer>): Promise<UnscramblePlayer | undefined> {
    const [updated] = await db.update(unscramblePlayers).set(data).where(eq(unscramblePlayers.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
