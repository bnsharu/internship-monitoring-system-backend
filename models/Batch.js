// backend/models/Batch.js
import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String },
  description: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Batch", batchSchema);
