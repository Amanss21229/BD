import { Router, type IRouter } from "express";
import { store } from "../store";

const router: IRouter = Router();

function checkPassword(password: string | undefined): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return !!adminPassword && password === adminPassword;
}

router.post("/admin/verify", (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "Password is required." });
    return;
  }
  if (!checkPassword(password)) {
    res.status(401).json({ error: "Incorrect password." });
    return;
  }
  res.json({ success: true });
});

router.get("/admin/chat-requests", (req, res) => {
  const password = req.query.password as string | undefined;
  if (!checkPassword(password)) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  const requests = store.getAll();
  res.json({ requests, total: requests.length });
});

router.get("/admin/chat-requests/download", (req, res) => {
  const password = req.query.password as string | undefined;
  if (!checkPassword(password)) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  const requests = store.getAll();

  const headers = ["ID", "Profile Name", "Profile Gender", "User Gender", "WhatsApp Number", "Mobile Number", "Submitted At"];
  const rows = requests.map((r) => [
    r.id,
    r.profileName,
    r.profileGender,
    r.userGender,
    r.whatsappNumber ?? "",
    r.mobileNumber ?? "",
    r.submittedAt,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="chat-requests-${Date.now()}.csv"`);
  res.send(csv);
});

export default router;
