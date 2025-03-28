import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Session from '../models/Session.js';

const router = express.Router();

// Save a typing session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { wpm, accuracy, totalErrors, errorWords, typingDurations } = req.body;

    const newSession = new Session({
      userId: req.user,
      wpm,
      accuracy,
      totalErrors,
      errorWords,
      typingDurations,
    });

    await newSession.save();
    res.status(201).json({ message: 'Session saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Get session history for a user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

export default router;
