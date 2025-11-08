import mongoose from 'mongoose';

const contentSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Khan Academy', 'OpenStax', 'MIT OpenCourseWare', 'Wikipedia', 'Original']
  },
  url: {
    type: String,
    required: true
  },
  license: {
    type: String,
    required: true
  },
  attribution: {
    type: String,
    required: true
  },
  lastFetched: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const ContentSource = mongoose.model('ContentSource', contentSourceSchema);

export default ContentSource;
