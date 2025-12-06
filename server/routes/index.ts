import express, { Request, Response } from "express";

const router = express.Router();

/* GET home route for SuiTinder API */
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to SuiTinder API",
    version: "1.0.0",
    status: "running",
    info: "Use /profiles or /matches to interact with the dApp"
  });
});

export default router;
