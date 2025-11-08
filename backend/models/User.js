import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    default: 'student',
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'es', 'fr', 'sw', 'pt', 'ar', 'bn'],
      default: 'en'
    },
    learningGoals: [{
      type: String
    }],
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    topicsOfInterest: [{
      type: String
    }],
    completedAt: {
      type: Date,
      default: null
    }
  },
  gamification: {
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivityDate: { type: Date, default: null }
    },
    badges: [{
      id: String,
      name: String,
      icon: String,
      earnedAt: Date
    }],
    totalPoints: { type: Number, default: 0 },
    weeklyGoal: { type: Number, default: 3 },
    monthlyGoal: { type: Number, default: 12 }
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;
