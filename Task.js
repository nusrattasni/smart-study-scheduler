import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  day: { type: String, enum: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"] },
  subject: { type: String, default: "" },
  dailyHours: { type: Number, default: 1 },
  priority: { type: String, default: "Medium" },
  goal: { type: String, default: "" },
  notes: { type: String, default: "" },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
