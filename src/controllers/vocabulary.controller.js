const Vocabulary = require('../models/vocabulary.model');
const UserVocabulary = require('../models/user_vocabulary.model');
const moment = require('moment');
const mongoose = require('mongoose');

const getVocabularies = async (request, response) => {
  try {
    const { lesson } = request.query;

    const vocabularies = await Vocabulary.find({ bai: Number(lesson || 1) }).sort({ index_in_lesson: 1 })

    return response.status(200).json({ data: vocabularies })
  } catch (error) {
    console.log(error);
    return response.status(500).json({ status: 500, message: 'Opps! Something went wrong when call api.' })
  }
};

const getLevelVocabulary = async (request, response) => {
  try {
    const vocabularyId = request.params.id;
    const userId = request.decoded._id;

    const userVocabulary = await UserVocabulary.findOne({
      user: mongoose.Types.ObjectId(userId),
      vocabulary: mongoose.Types.ObjectId(vocabularyId)
    });

    if (!userVocabulary) {
      return response.status(200).json({ status: 200, data: 0 })
    }
    return response.status(200).json({ status: 200, data: userVocabulary.level })
  } catch (error) {
    console.log(error);
    return response.status(500).json({ status: 500, message: 'Opps! Something went wrong when call api.' })
  }
};

const learnVocabulary = async (request, response) => {
  try {
    const vocabularyId = request.params.id;
    const userId = request.decoded._id;

    const userVocabulary = await UserVocabulary.findOne({
      user: mongoose.Types.ObjectId(userId),
      vocabulary: mongoose.Types.ObjectId(vocabularyId)
    });

    if (userVocabulary) {
      return response.status(400).json({ status: 400, message: 'Invalid data.' })
    }

    const newUserVocabulary = new UserVocabulary({
      user: userId,
      vocabulary: vocabularyId,
      level: 1,
      next_test_at: moment().add(1, 'day').startOf('day')
    });

    await newUserVocabulary.save();
    return response.status(200).json({ status: 200 })
  } catch (error) {
    console.log(error);
    return response.status(500).json({ status: 500, message: 'Opps! Something went wrong when call api.' })
  }
};

const getVocabulariesRandom = async (request, response) => {
  try {
    const vocabularyId = request.params.id;

    const vocabulary = await Vocabulary.findById(vocabularyId);

    if (!vocabulary) {
      return response.status(403).json({ status: 403, message: 'Not found.' })
    }

    const lesson = vocabulary.bai;
    const index_in_lesson = vocabulary.index_in_lesson;

    const vocabularies = await Vocabulary.aggregate([
      { 
        $match: {
          bai: lesson,
          index_in_lesson: { $ne: index_in_lesson }
        }
      },
      { $sample: { size: 3 } }
    ])

    const shuffleArray = a => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const _vocabularies = shuffleArray([...vocabularies, vocabulary])

    return response.status(200).json({ data: _vocabularies })
  } catch(error) {
    console.log(error);
    return response.status(500).json({ status: 500, message: 'Opps! Something went wrong when call api.' })
  }
}

module.exports = {
  getVocabularies,
  learnVocabulary,
  getLevelVocabulary,
  getVocabulariesRandom
}