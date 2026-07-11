const { validationResult } = require('express-validator');
const Category = require('../models/Category');
const Note = require('../models/Note');

// @desc    Get all categories for user (with note counts)
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ userId: req.user._id }).sort({ name: 1 });

    const counts = await Note.aggregate([
      { $match: { userId: req.user._id, deleted: false, category: { $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

    const result = categories.map((c) => ({
      ...c.toObject(),
      noteCount: countMap.get(String(c._id)) || 0,
    }));

    res.status(200).json({ success: true, categories: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, color } = req.body;

    const existing = await Category.findOne({ userId: req.user._id, name });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A category with this name already exists' });
    }

    const category = await Category.create({ userId: req.user._id, name, color });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Rename / recolor category
// @route   PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.user._id });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const { name, color } = req.body;
    if (name) category.name = name;
    if (color) category.color = color;

    await category.save();
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (unassigns notes from it)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await Note.updateMany({ userId: req.user._id, category: category._id }, { $set: { category: null } });

    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
