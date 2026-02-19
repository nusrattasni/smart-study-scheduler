// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  duration: { type: Number, required: true },
  difficulty: { type: String },
  goal: { type: String },
  day: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;  // ✅ ES Module export
