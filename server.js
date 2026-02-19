const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); // <-- add this

// Load environment variables from .env
dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Test Route =====
app.get('/', (req, res) => {
  res.send('Smart Study Scheduler API is running...');
});

// ===== Latest Image Route =====
app.get('/api/latest-image', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Error reading uploads folder' });

    // Filter only image files
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));

    if (images.length === 0) return res.status(404).json({ message: 'No images found' });

    // Sort by modified time (newest first)
    const sorted = images.sort((a, b) => {
      const aTime = fs.statSync(path.join(uploadsDir, a)).mtime;
      const bTime = fs.statSync(path.join(uploadsDir, b)).mtime;
      return bTime - aTime;
    });

    // Return the latest image path
    res.json({ latestImage: `/uploads/${sorted[0]}` });
  });
});

// ===== Task Routes =====
// taskRoutes.js is in the same folder
const taskRoutes = require('./taskRoutes');
app.use('/api/tasks', taskRoutes);

// ===== MongoDB Connection =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
