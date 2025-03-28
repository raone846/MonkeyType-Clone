import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  totalErrors: { type: Number, required: true },
  errorWords: { type: [String], required: true },
  typingDurations: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Session', SessionSchema);
