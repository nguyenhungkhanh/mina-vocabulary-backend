const mongoose = require('mongoose')

const vocabularySchema = new mongoose.Schema({
  bai: {
    type: Number,
    required: true,
  },
  index_in_lesson: {
    type: Number,
  },
  tu_vung_kanji: {
    type: String,
  },
  tu_vung: {
    type: String,
    required: true,
  },
  han_tu: {
    type: String,
  },
  am_han: {
    type: String,
  },
  phat_am: {
    type: String,
  },
  nghia: {
    type: String,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('Vocabulary', vocabularySchema)