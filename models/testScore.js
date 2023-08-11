const mongoose = require('mongoose');

const testScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  correctCount: {
    type: String,
    required: true,
  },
  incorrectCount: {
    type: String,
    required: true,
  },
  blankCount:{
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  tarih: {
    type: Date,
    default: Date.now,
  },
});

const TestScore = mongoose.model('TestScore', testScoreSchema);

module.exports = TestScore;
