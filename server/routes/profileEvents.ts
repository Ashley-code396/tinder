import express from "express";
import { fetchProfileEvents } from "../services/events/profileEvents";

const router = express.Router();

router.get("/profile-events", async (req, res) => {
  try {
    const cursor = req.query.cursor?.toString() || null;
    const limit = req.query.limit ? Number(req.query.limit) : 50;

    const result = await fetchProfileEvents({ cursor, limit });

    res.json(result); // FULL Sui blockchain event data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
