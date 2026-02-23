import type { Express } from "express";
import { storage } from "./storage";
import type { InsertGameRoom, InsertGamePlayer } from "@shared/schema";

export function registerRoutes(app: Express): void {
  app.post("/api/rooms", async (req, res) => {
    try {
      const body = req.body as any;
      const room = await storage.createRoom({
        grid: body.grid,
        placedWords: body.placedWords,
        words: body.words,
        status: "waiting",
      } as InsertGameRoom);
      res.json(room);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.id);
      if (!room) return res.status(404).json({ error: "Room not found" });
      res.json(room);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.updateRoom(req.params.id, req.body as any);
      if (!room) return res.status(404).json({ error: "Room not found" });
      res.json(room);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const body = req.body as any;
      const player = await storage.createPlayer({
        roomId: body.roomId,
        name: body.name,
        isAdmin: body.isAdmin,
      } as InsertGamePlayer);
      res.json(player);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/rooms/:roomId/players", async (req, res) => {
    try {
      const players = await storage.getPlayersByRoom(req.params.roomId);
      res.json(players);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.updatePlayer(req.params.id, req.body as any);
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
