import { Router, type IRouter } from "express";
import { db, rechargeRequestsTable } from "@workspace/db";
import { AdminVerifyBody, AdminGetRechargeRequestsQueryParams } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

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

// GET /api/admin/recharge-requests - Get all recharge requests
router.get("/admin/recharge-requests", async (req, res) => {
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

  try {
    const requests = await db
      .select()
      .from(rechargeRequestsTable)
      .orderBy(desc(rechargeRequestsTable.submittedAt));

    res.json({
      requests: requests.map((r) => ({
        id: r.id,
        mobileNumber: r.mobileNumber,
        referredBy: r.referredBy,
        submittedAt: r.submittedAt.toISOString(),
      })),
      total: requests.length,
    });
  } catch (err) {
    req.log.error(err, "Failed to fetch recharge requests");
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

export default router;
