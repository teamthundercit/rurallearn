import mongoose from 'mongoose';

const aiInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['recommendation', 'chat'],
    required: true
  },
  input: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    comment: 'User input or context data sent to AI'
  },
  output: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    comment: 'AI response or recommendations'
  }
}, {
  timestamps: true
});

// Indexes for performance optimization
aiInteractionSchema.index({ userId: 1, createdAt: -1 });
aiInteractionSchema.index({ userId: 1, type: 1 });
aiInteractionSchema.index({ createdAt: -1 });

const AIInteraction = mongoose.model('AIInteraction', aiInteractionSchema);

export default AIInteraction;
