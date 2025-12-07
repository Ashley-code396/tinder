import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { FRONTEND_URL } from "./config/index";

// Import routers
import indexRouter from "./routes/index";
import profileRouter from "./routes/profile";
import whitelistRouter from "./routes/whitelist";
import { startProfileEventCron } from "./cron/profileEventCron";

startProfileEventCron();


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

export default app;
