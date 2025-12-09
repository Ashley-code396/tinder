import dotenv from "dotenv";
dotenv.config();
import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";


import { FRONTEND_URL } from "./config/index";

// Import routers
import indexRouter from "./routes/index";
import profileRouter from "./routes/profile";
import whitelistRouter from "./routes/whitelist";


// Import cron job
import { startProfileEventCron } from "./cron/profileEventsCron";


const app = express();

// CORS Configuration
const corsOptions = {
  origin: FRONTEND_URL,          // Frontend URL from config/env
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,             // Allow cookies/auth headers
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Routes
app.use("/", indexRouter);
app.use("/api/profile", profileRouter);
app.use("/api/whitelist", whitelistRouter);


// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

//Start cron job

startProfileEventCron()
  .then(() => console.log("Profile event cron started"))
  .catch((err) => console.error("Failed to start profile event cron:", err));


export default app;
