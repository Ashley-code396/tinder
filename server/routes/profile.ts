import express, { Request, Response } from "express";
import { buildProfileMintTx } from "../services/sui/mint";
import { ProfileMintParams } from "../../client/app/profile/types";

const router = express.Router();

router.post("/build-profile-tx", async (req: Request, res: Response) => {
  try {
    const mintParams: ProfileMintParams = req.body; 
    const tx = buildProfileMintTx(mintParams);

    res.json({ tx: tx.toJSON() });
    
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
