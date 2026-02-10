// backend/models/User.js
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "mentor", "student"], default: "student" },

  // Optional references for students
  mentor: { type: Schema.Types.ObjectId, ref: "User", default: null },
  department: { type: Schema.Types.ObjectId, ref: "Department", default: null },
  batch: { type: Schema.Types.ObjectId, ref: "Batch", default: null }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
