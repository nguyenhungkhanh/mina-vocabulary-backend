const mongoose = require('mongoose')

const vocabularySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vocabulary: { type: mongoose.Schema.Types.ObjectId, ref: 'Vocabulary' },
  level: {
    type: Number,
    default: 1,
  },
  next_test_at: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('UserVocabulary', vocabularySchema)