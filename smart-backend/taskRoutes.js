import express from 'express';
import { addTask, getTasks, deleteTask } from './taskController.js';
import { protect } from './authMiddleware.js';

const router = express.Router();

router.post('/tasks', protect, addTask);
router.get('/tasks', protect, getTasks);
router.delete('/tasks/:id', protect, deleteTask); // ← ADD THIS

export default router;
