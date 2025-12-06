import express from "express";
import { buildCreateWhitelistEntryTx } from "../services/sui/mint";
import { useNetworkVariable } from "../../client/app/networkConfig";

const router = express.Router();
const packageId = useNetworkVariable("packageId");

router.post("/create-whitelist-entry", async (req, res) => {
    try {
        const { tx, whitelistId } = buildCreateWhitelistEntryTx(packageId);


        const txJSON = tx.toJSON();

        res.json({ tx: txJSON, whitelistId });
    } catch (err: any) {
        console.error("Failed to create whitelist entry:", err);
        res.status(500).json({ error: err.message || "Failed to create whitelist entry" });
    }
});

export default router;
