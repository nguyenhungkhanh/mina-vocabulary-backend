const { Router } = require('express');
const { userVocabularyController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = Router();

router.get('/user_vocabularies/today', authMiddleware, userVocabularyController.getVocabulariesToday)
router.get('/user_vocabularies/review', authMiddleware, userVocabularyController.getVocabulariesReview)
router.get('/user_vocabularies/statistics', authMiddleware, userVocabularyController.getStatistics)
router.post('/user_vocabularies/:id/do_review', authMiddleware, userVocabularyController.doReview)

module.exports = router;