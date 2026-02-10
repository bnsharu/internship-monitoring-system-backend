import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  mentorName: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, default: "Not specified" },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Internship", internshipSchema);
