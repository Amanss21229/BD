import { Router, type IRouter } from "express";
import { AdminVerifyBody, AdminGetRechargeRequestsQueryParams } from "@workspace/api-zod";
import { store } from "../store";

const router: IRouter = Router();

// POST /api/admin/verify - Verify admin password
router.post("/admin/verify", (req, res) => {
  const parsed = AdminVerifyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Password is required." });
    return;
  }

  const { password } = parsed.data;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    res.status(401).json({ error: "Incorrect password. / गलत पासवर्ड।" });
    return;
  }

  res.json({ success: true, token: Buffer.from(password).toString("base64") });
});

// GET /api/admin/recharge-requests - Get all recharge requests (admin only)
router.get("/admin/recharge-requests", (req, res) => {
  const parsed = AdminGetRechargeRequestsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(401).json({ error: "Password is required." });
    return;
  }

  const { password } = parsed.data;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    res.status(401).json({ error: "Unauthorized. / अनधिकृत।" });
    return;
  }

  const requests = store.getAll();
  res.json({ requests, total: requests.length });
});

export default router;
