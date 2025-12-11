import express from "express";
import { getMatches } from "../services/matchEngine/getMatches";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const matches = await getMatches(userId);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
