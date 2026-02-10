// backend/routes/userRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/users
 * Query params: role (student|mentor|admin), search
 */
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { role, search } = req.query;
    const q = {};
    if (role) q.role = role;
    if (search) q.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
    const users = await User.find(q).select("-password").populate("department").populate("batch").populate("mentor", "name email");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/users
 * Create user (admin only)
 */
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role, department, batch, mentor } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "student",
      department: department || null,
      batch: batch || null,
      mentor: mentor || null
    });

    res.status(201).json({ message: "User created", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/users/:id
 * Update user (admin only)
 */
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/users/:id
 */
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/users/:id/assign-mentor
 * Body: { mentorId }
 */
router.put("/:id/assign-mentor", verifyToken, isAdmin, async (req, res) => {
  try {
    const { mentorId } = req.body;
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") return res.status(400).json({ message: "Invalid mentor" });

    const student = await User.findByIdAndUpdate(req.params.id, { mentor: mentorId }, { new: true }).select("-password").populate("mentor", "name email");
    res.json({ message: "Assigned mentor", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
