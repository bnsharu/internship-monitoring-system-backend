import express from "express";
import Internship from "../models/Internship.js";

const router = express.Router();

// GET (with search)
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const result = await Internship.find({
    $or: [
      { studentName: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } }
    ]
  }).sort({ createdAt: -1 });

  res.json(result);
});

// POST
router.post("/", async (req, res) => {
  const internship = new Internship(req.body);
  await internship.save();
  res.json(internship);
});

// PUT
router.put("/:id", async (req, res) => {
  const updated = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Internship.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
