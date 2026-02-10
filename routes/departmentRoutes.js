// backend/routes/departmentRoutes.js
import express from "express";
import Department from "../models/Department.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all departments (admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const list = await Department.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
});

// POST create department
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const exists = await Department.findOne({ name });
    if (exists) return res.status(400).json({ message: "Department exists" });
    const d = await Department.create({ name, description });
    res.status(201).json(d);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
});

// PUT update
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
});

export default router;
