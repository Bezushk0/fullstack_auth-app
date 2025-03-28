const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getProfile,
  updateName,
  updatePassword,
  updateEmail,
  confirmEmailChange,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile/name', authMiddleware, updateName);
router.put('/profile/password', authMiddleware, updatePassword);
router.put('/profile/updateEmail', authMiddleware, updateEmail);
router.post('/confirm-email-change', confirmEmailChange);

router.post('/password-reset-request', requestPasswordReset);
router.post('/password-reset', resetPassword);

module.exports = router;
