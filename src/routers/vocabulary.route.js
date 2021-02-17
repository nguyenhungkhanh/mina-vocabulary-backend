const { Router } = require('express');
const { vocabularyController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = Router();

router.get('/vocabularies', authMiddleware, vocabularyController.getVocabularies)
router.get('/vocabularies/:id/learn', authMiddleware, vocabularyController.learnVocabulary)
router.get('/vocabularies/:id/get_level', authMiddleware, vocabularyController.getLevelVocabulary)
router.get('/vocabularies/:id/random_answers', authMiddleware, vocabularyController.getVocabulariesRandom)

module.exports = router;