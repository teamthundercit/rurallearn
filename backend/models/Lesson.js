import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: {
      type: String,
      enum: ['text', 'video', 'mixed'],
      required: true
    },
    text: {
      type: String
    },
    videoUrl: {
      type: String
    }
  },
  quiz: {
    questions: [{
      question: {
        type: String,
        required: true
      },
      options: {
        type: [String],
        required: true,
        validate: {
          validator: function(v) {
            return v && v.length >= 2;
          },
          message: 'Quiz must have at least 2 options'
        }
      },
      correctAnswer: {
        type: Number,
        required: true,
        validate: {
          validator: function(v) {
            return v >= 0 && v < this.options.length;
          },
          message: 'Correct answer index must be valid'
        }
      },
      explanation: {
        type: String
      }
    }]
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: {
    type: [String],
    default: []
  },
  source: {
    name: {
      type: String,
      default: 'Original'
    },
    url: {
      type: String
    },
    license: {
      type: String
    },
    attribution: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Indexes for performance optimization
lessonSchema.index({ difficulty: 1 });
lessonSchema.index({ tags: 1 });
lessonSchema.index({ createdAt: -1 });
lessonSchema.index({ difficulty: 1, tags: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
