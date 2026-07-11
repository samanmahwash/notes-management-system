const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { changePasswordValidator } = require('../validators/authValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePasswordValidator, changePassword);

module.exports = router;
