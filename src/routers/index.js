const userRoute = require('./user.route')
const authRoute = require('./auth.router')
const vocabularyRoute = require('./vocabulary.route');
const userVocabularyRoute = require('./user_vocabulary.router');

module.exports = [userRoute, authRoute, vocabularyRoute, userVocabularyRoute]