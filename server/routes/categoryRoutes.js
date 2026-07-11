const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { categoryValidator } = require('../validators/categoryValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getCategories);
router.post('/', categoryValidator, createCategory);
router.put('/:id', categoryValidator, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
