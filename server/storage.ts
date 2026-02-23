import { eq } from "drizzle-orm";
import { db } from "./db";
import { gameRooms, gamePlayers, type InsertGameRoom, type InsertGamePlayer, type GameRoom, type GamePlayer } from "@shared/schema";

export interface IStorage {
  createRoom(room: InsertGameRoom): Promise<GameRoom>;
  getRoom(id: string): Promise<GameRoom | undefined>;
  updateRoom(id: string, data: Partial<GameRoom>): Promise<GameRoom | undefined>;
  createPlayer(player: InsertGamePlayer): Promise<GamePlayer>;
  getPlayersByRoom(roomId: string): Promise<GamePlayer[]>;
  getPlayer(id: string): Promise<GamePlayer | undefined>;
  updatePlayer(id: string, data: Partial<GamePlayer>): Promise<GamePlayer | undefined>;
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
}

export const storage = new DatabaseStorage();
