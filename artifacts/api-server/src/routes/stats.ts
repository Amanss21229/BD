import { Router, type IRouter } from "express";
import { statsStore } from "../store";

const router: IRouter = Router();

function checkPassword(password: string | undefined): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return !!adminPassword && password === adminPassword;
}

router.post("/stats/heartbeat", (req, res) => {
  const { sessionId, gender } = req.body;
  if (
    typeof sessionId !== "string" ||
    !sessionId ||
    !["male", "female"].includes(gender)
  ) {
    res.status(400).json({ error: "sessionId and gender are required." });
    return;
  }
  statsStore.heartbeat(sessionId, gender as "male" | "female");
  res.json({ ok: true });
});

router.get("/admin/stats", (req, res) => {
  const password = req.query.password as string | undefined;
  if (!checkPassword(password)) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  res.json({
    live: statsStore.getLive(),
    dailyVisits: statsStore.getDailyVisits(),
  });
});

export default router;
