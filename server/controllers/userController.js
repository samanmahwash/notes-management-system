const { validationResult } = require('express-validator');
const User = require('../models/User');
const Note = require('../models/Note');
const Category = require('../models/Category');

// @desc    Get current user profile with note stats
// @route   GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalNotes, favoriteNotes, archivedNotes, pinnedNotes, totalCategories] = await Promise.all([
      Note.countDocuments({ userId, deleted: false }),
      Note.countDocuments({ userId, favorite: true, deleted: false }),
      Note.countDocuments({ userId, archived: true, deleted: false }),
      Note.countDocuments({ userId, pinned: true, deleted: false }),
      Category.countDocuments({ userId }),
    ]);

    res.status(200).json({
      success: true,
      user: req.user.toSafeObject(),
      stats: {
        totalNotes,
        favoriteNotes,
        archivedNotes,
        pinnedNotes,
        totalCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile (name, avatar)
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.status(200).json({ success: true, user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
