import { Router, type IRouter } from "express";
import { profileStore } from "../store";

const router: IRouter = Router();

function checkPassword(password: string | undefined): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return !!adminPassword && password === adminPassword;
}

router.get("/profiles", (_req, res) => {
  const profiles = profileStore.getAll();
  res.json({ profiles });
});

router.post("/admin/profiles", (req, res) => {
  const { password, name, age, city, gender, bio, photo } = req.body;

  if (!checkPassword(password)) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  if (!name || !age || !city || !gender || !photo) {
    res.status(400).json({ error: "Name, age, city, gender, and photo are required." });
    return;
  }

  if (!["male", "female"].includes(gender)) {
    res.status(400).json({ error: "Gender must be male or female." });
    return;
  }

  const parsedAge = Number(age);
  if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 70) {
    res.status(400).json({ error: "Age must be between 18 and 70." });
    return;
  }

  const profile = profileStore.add({
    name: String(name),
    age: parsedAge,
    city: String(city),
    gender: gender as "male" | "female",
    bio: bio ? String(bio) : "Looking for a genuine connection ❤️",
    photos: [String(photo)],
  });

  res.status(201).json({ success: true, profile });
});

export default router;
