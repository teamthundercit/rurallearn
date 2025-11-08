import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  completedAt: {
    type: Date,
    default: null
  },
  quizScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  quizAttempts: {
    type: Number,
    default: 0,
    min: 0
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0,
    comment: 'Time spent in minutes'
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound unique index to ensure one progress record per user per lesson
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Indexes for performance optimization
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ userId: 1, completedAt: -1 });
progressSchema.index({ lastAccessedAt: -1 });

// Update lastAccessedAt before saving
progressSchema.pre('save', function(next) {
  this.lastAccessedAt = new Date();
  next();
});

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
