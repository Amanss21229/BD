import { Router, type IRouter } from "express";
import { db, rechargeRequestsTable } from "@workspace/db";
import { SubmitRechargeRequestBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// POST /api/recharge-requests - Submit a mobile number for free recharge
router.post("/recharge-requests", async (req, res) => {
  const parsed = SubmitRechargeRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid mobile number. Please provide a valid 10-digit number." });
    return;
  }

  const { mobileNumber, referredBy } = parsed.data;

  // Validate 10-digit mobile number
  if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
    res.status(400).json({ error: "Please enter a valid 10-digit Indian mobile number." });
    return;
  }

  try {
    // Check if already submitted
    const existing = await db
      .select()
      .from(rechargeRequestsTable)
      .where(eq(rechargeRequestsTable.mobileNumber, mobileNumber))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "This number has already been submitted for recharge. / यह नंबर पहले से सबमिट किया जा चुका है।" });
      return;
    }

    const [inserted] = await db
      .insert(rechargeRequestsTable)
      .values({ mobileNumber, referredBy: referredBy ?? null })
      .returning();

    res.status(201).json({
      id: inserted.id,
      mobileNumber: inserted.mobileNumber,
      submittedAt: inserted.submittedAt.toISOString(),
      message: "Your ₹349 recharge request has been submitted! / आपका ₹349 रिचार्ज अनुरोध सबमिट हो गया है!",
    });
  } catch (err) {
    req.log.error(err, "Failed to submit recharge request");
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

export default router;
