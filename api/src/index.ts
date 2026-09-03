import "dotenv/config";
import express from "express";
import cors from "cors";
import { requireAuth } from "./middleware/auth.js";
import { workoutsRouter } from "./routes/workouts.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/workouts", requireAuth, workoutsRouter);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
