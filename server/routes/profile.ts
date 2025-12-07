import express, { Request, Response } from "express";
import { buildProfileMintTx } from "../services/sui/mint";
import { ProfileMintParams } from "../../client/app/profile/types";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

const router = express.Router();


// Handle preflight for this router specifically
router.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.sendStatus(204);
});

router.post("/build-profile-tx", async (req: Request, res: Response) => {
  try {
    const mintParams: ProfileMintParams = req.body;
    const tx = buildProfileMintTx(mintParams);

    const txBytes = await tx.build({
      client,
      onlyTransactionKind: true
    })

    console.log("📦 Serialized tx bytes:", txBytes);

    res.json({ txBytes });

  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
