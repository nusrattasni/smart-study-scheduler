import Task from './task.js';

// ➕ ADD TASK
export const addTask = async (req, res) => {
  try {
    const { subject, duration, difficulty, goal, day } = req.body;

    // Validate required fields
    if (!subject || !duration || !day) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new task with logged-in user
    const task = new Task({
      user: req.user._id,   // 👈 use _id from middleware
      subject,
      duration,
      difficulty,
      goal,
      day,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📥 GET TASKS
export const getTasks = async (req, res) => {
  try {
    // Fetch only tasks of logged-in user, sorted by day
    const tasks = await Task.find({ user: req.user._id }).sort({ day: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Example using MongoDB / Mongoose
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ FIXED ownership check
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
