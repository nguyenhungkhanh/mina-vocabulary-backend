const userController = require('./user.controller');
const authController = require('./auth.controller')
const vocabularyController = require('./vocabulary.controller');
const userVocabularyController = require('./user_vocabulary.controller');

module.exports = {
  userController,
  authController,
  vocabularyController,
  userVocabularyController
}