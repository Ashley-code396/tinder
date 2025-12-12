import express, { Request, Response } from "express";
import { buildProfileMintTx } from "../services/sui/mint";
import { ProfileMintParams } from "../../client/app/profile/types";
import { client } from "./../services/sui/provider"
import { prisma } from "../prisma/prismaClient";



const router = express.Router();

interface SyncProfileBody {
  ownerAddress: string;
  nftObjectId: string;
  firstName: string;
  email: string;
  birthday: string;       // ISO string or timestamp
  gender: string;
  interestedIn: string;
  showGender?: boolean;   // optional, default true
  photos?: any;           // optional JSON
  quiltId?: string;       // optional
}



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
    tx.setSender(mintParams.sender); 

    const txBytes = await tx.build({
      client,
    });

    //console.log("📦 Serialized tx bytes:", txBytes);

    const txBytesBase64 = Buffer.from(txBytes).toString("base64");
    //console.log("📦 Serialized tx bytes (base64):", txBytesBase64);

    

    res.json({ txBytesBase64 });

  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/sync-profile", async (req: Request, res: Response) => {
  try {
    const { ownerAddress, firstName, email, birthday } = req.body;

    if (!ownerAddress) return res.status(400).json({ error: "Missing ownerAddress" });

    // Upsert profile
    const user = await prisma.userProfile.upsert({
      where: { ownerAddress },
      update: { firstName, email, birthday },
      create: { ownerAddress, firstName, email, birthday },
    });

    // Return the ID to the frontend
    res.json({ userId: user.id });
  } catch (err: any) {
    console.error("Sync profile failed:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;