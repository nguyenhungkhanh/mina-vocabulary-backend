const UserVocabulary = require('../models/user_vocabulary.model');
const moment = require('moment');
const mongoose = require('mongoose');

const getNextTestAtByLevel = level => {
  let next_test_at;

  if (level === 1) {
    next_test_at = moment().add(1, 'day').startOf('day')
  } else if (level === 2) {
    next_test_at = moment().add(3, 'day').startOf('day')
  } else if (level === 3) {
    next_test_at = moment().add(7, 'day').startOf('day')
  } else if (level === 4) {
    next_test_at = moment().add(14, 'day').startOf('day')
  } else if (level === 5) {
    next_test_at = moment().add(28, 'day').startOf('day')
  }

  return next_test_at;
};

const getVocabulariesToday = async (request, response) => {
  try {
    const userId = request.decoded._id;

    const vocabularies = await UserVocabulary.find({
      user: mongoose.Types.ObjectId(userId),
      created_at: {
        $gte: moment().startOf('day'),
        $lte: moment().endOf('day'),
      }
    }).populate('vocabulary').lean()

    const _vocabularies = vocabularies.map(v => ({
      ...v.vocabulary
    }));

    return response.status(200).json({
      data: _vocabularies
    })
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      status: 500,
      message: 'Opps! Something went wrong when call api.'
    })
  }
};

const getVocabulariesReview = async (request, response) => {
  try {
    const userId = request.decoded._id;

    const vocabularies = await UserVocabulary.find({
      user: mongoose.Types.ObjectId(userId),
      next_test_at: {
        $gte: moment().startOf('day'),
        $lte: moment().endOf('day'),
      }
    }).populate('vocabulary').lean()

    const _vocabularies = vocabularies.map(v => ({
      ...v.vocabulary,
      level: v.level,
      user_vocabulary_id: v._id
    }));

    const shuffleArray = a => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    return response.status(200).json({
      data: shuffleArray(_vocabularies)
    })
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      status: 500,
      message: 'Opps! Something went wrong when call api.'
    })
  }
};

const getStatistics = async (request, response) => {
  try {
    const userId = request.decoded._id;
    const statistics = await UserVocabulary.aggregate([{
        $match: {
          user: mongoose.Types.ObjectId(userId),
        }
      },
      {
        "$group": {
          _id: "$level",
          count: {
            $sum: 1
          }
        }
      }
    ])
    
    const numberOfVocabulariesReview = await UserVocabulary.countDocuments({
      user: mongoose.Types.ObjectId(userId),
      next_test_at: {
        $gte: moment().startOf('day'),
        $lte: moment().endOf('day'),
      }
    })
    
    const _statistics = [0, 0, 0, 0, 0] //Level 1-5

    for(let statistic of statistics) {
      _statistics[statistic._id - 1] = statistic.count
    }

    return response.status(200).json({
      statistics: _statistics,
      numberOfVocabulariesReview
    })
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      status: 500,
      message: 'Opps! Something went wrong when call api.'
    })
  }
}

const doReview = async (request, response) => {
  try {
    const userVocabularyId = request.params.id;
    const is_correct = request.body.is_correct || false;
    const userId = request.decoded._id;

    const userVocabulary = await UserVocabulary.findOne({
      _id: userVocabularyId,
      user: mongoose.Types.ObjectId(userId),
      next_test_at: {
        $gte: moment().startOf('day')
      }
    });

    if (!userVocabulary) {
      return response.status(400).json({ status: 400, message: 'Invalid data.' })
    }

    let level = userVocabulary.level > 1 ? userVocabulary.level - 1 : 1;
    if (is_correct) {
      level = (userVocabulary.level + 1) > 5 ? 5 : userVocabulary.level + 1;
    }

    const next_test_at = getNextTestAtByLevel(level);

    await UserVocabulary.updateOne({ _id: userVocabulary._id }, { level, next_test_at })

    return response.status(200).json({ status: 200 })
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      status: 500,
      message: 'Opps! Something went wrong when call api.'
    })
  }
};

module.exports = {
  getVocabulariesToday,
  getVocabulariesReview,
  getStatistics,
  doReview
}