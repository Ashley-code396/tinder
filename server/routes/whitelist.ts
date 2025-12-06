import express from "express";
import { buildCreateWhitelistEntryTx } from "../services/sui/mint";
import { packageId } from "../config/network";


const router = express.Router();


router.post("/create-whitelist-entry", async (req, res) => {
    try {
        const { tx, whitelistId } = buildCreateWhitelistEntryTx(packageId);



        res.json({ tx, whitelistId });
    } catch (err: any) {
        console.error("Failed to create whitelist entry:", err);
        res.status(500).json({ error: err.message || "Failed to create whitelist entry" });
    }
});

export default router;
