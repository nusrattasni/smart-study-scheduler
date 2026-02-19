// taskRoutes.js
const express = require('express');
const multer = require('multer');
const Task = require('./Task');

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});
const upload = multer({ storage });

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();

    // Add full URL for image
    const updatedTasks = tasks.map(task => {
      return {
        ...task._doc,
        image: task.image ? `${req.protocol}://${req.get('host')}/uploads/${task.image}` : null
      };
    });

    res.json(updatedTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task (with optional image upload)
router.post('/', upload.single('image'), async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    image: req.file ? req.file.filename : null
  });

  try {
    const newTask = await task.save();

    // Return full image URL in response
    res.status(201).json({
      ...newTask._doc,
      image: newTask.image ? `${req.protocol}://${req.get('host')}/uploads/${newTask.image}` : null
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
