// backend/routes/batchRoutes.js
import express from "express";
import Batch from "../models/Batch.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const list = await Batch.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, year, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const b = await Batch.create({ name, year, description });
    res.status(201).json(b);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
});

export default router;
