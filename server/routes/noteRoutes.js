const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  restoreNote,
  getTrash,
  permanentlyDeleteNote,
  togglePin,
  toggleArchive,
  toggleFavorite,
  duplicateNote,
  getDashboardStats,
} = require('../controllers/noteController');
const { noteValidator } = require('../validators/noteValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats/dashboard', getDashboardStats);
router.get('/trash/all', getTrash);

router.get('/', getNotes);
router.post('/', noteValidator, createNote);

router.get('/:id', getNote);
router.put('/:id', noteValidator, updateNote);
router.delete('/:id', deleteNote);

router.patch('/restore/:id', restoreNote);
router.delete('/permanent/:id', permanentlyDeleteNote);
router.patch('/pin/:id', togglePin);
router.patch('/archive/:id', toggleArchive);
router.patch('/favorite/:id', toggleFavorite);
router.post('/duplicate/:id', duplicateNote);

module.exports = router;
