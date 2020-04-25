const { Router } = require('express');
const { authController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = Router();

router.post('/auth/login', authController.login)
router.post('/auth/reset_password', authController.resetPassword)
router.post('/auth/update_password', authMiddleware, authController.updatePassword)

module.exports = router;