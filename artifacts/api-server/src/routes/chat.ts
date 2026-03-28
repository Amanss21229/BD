import { Router, type IRouter } from "express";
import { store } from "../store";

const router: IRouter = Router();

router.post("/chat-requests", (req, res) => {
  const { profileId, profileName, profileGender, userGender, whatsappNumber, mobileNumber } = req.body;

  if (!profileId || !profileName || !profileGender || !userGender) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  if (!whatsappNumber && !mobileNumber) {
    res.status(400).json({ error: "Please provide a WhatsApp number or mobile number." });
    return;
  }

  const phoneRegex = /^[6-9]\d{9}$/;

  if (whatsappNumber && !phoneRegex.test(whatsappNumber)) {
    res.status(400).json({ error: "Please enter a valid 10-digit WhatsApp number." });
    return;
  }

  if (mobileNumber && !phoneRegex.test(mobileNumber)) {
    res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
    return;
  }

  const entry = store.add({
    profileId: Number(profileId),
    profileName: String(profileName),
    profileGender: profileGender as "male" | "female",
    userGender: userGender as "male" | "female",
    whatsappNumber: whatsappNumber ? String(whatsappNumber) : null,
    mobileNumber: mobileNumber ? String(mobileNumber) : null,
  });

  res.status(201).json({ success: true, id: entry.id });
});

export default router;
