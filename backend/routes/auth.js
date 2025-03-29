import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid credentials', user, password, user.password);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get authenticated user
router.get('/user', async (req, res) => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
});


export default router;
