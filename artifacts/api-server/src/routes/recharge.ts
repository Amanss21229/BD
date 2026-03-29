import { Router, type IRouter } from "express";
import { SubmitRechargeRequestBody } from "@workspace/api-zod";
import { rechargeStore as store } from "../store";

const router: IRouter = Router();

// POST /api/recharge-requests - Submit a mobile number for free recharge
router.post("/recharge-requests", (req, res) => {
  const parsed = SubmitRechargeRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input. Please provide a valid mobile number." });
    return;
  }

  const { mobileNumber, referredBy } = parsed.data;

  if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
    res.status(400).json({ error: "Please enter a valid 10-digit Indian mobile number." });
    return;
  }

  if (store.findByNumber(mobileNumber)) {
    res.status(409).json({
      error: "This number has already been submitted. / यह नंबर पहले से सबमिट किया जा चुका है।",
    });
    return;
  }

  const entry = store.add(mobileNumber, referredBy);

  res.status(201).json({
    id: entry.id,
    mobileNumber: entry.mobileNumber,
    submittedAt: entry.submittedAt,
    message: "Your ₹349 recharge request has been submitted! / आपका ₹349 रिचार्ज अनुरोध सबमिट हो गया है!",
  });
});

export default router;
