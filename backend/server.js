import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from './models/User.js';
import Task from './models/Task.js';
import { protect } from './middleware/auth.js';

dotenv.config();
const app = express();

app.use(express.json());

/* changed here see if that fixes this */
/*did not made it worse */
/*cant connect to database?*/

app.use(cors({ 
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] 
}));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running smoothly' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Registration successful! Please log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', protect, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Task title is required' });

    const newTask = await Task.create({ title, user: req.user.id });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', protect, async (req, res) => {
  try {
    const { title, status } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

const PORT = process.env.PORT || 5050;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server on port ${PORT}. DB Connected.`)))
  .catch(err => console.error('Database connection error:', err));
