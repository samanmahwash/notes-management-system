const { validationResult } = require('express-validator');
const Note = require('../models/Note');

// @desc    Get all notes for user (with search, filters, sort)
// @route   GET /api/notes
const getNotes = async (req, res, next) => {
  try {
    const { search, category, favorite, archived, pinned, sort, page = 1, limit = 20 } = req.query;

    const query = { userId: req.user._id, deleted: false };

    if (category) query.category = category;
    if (favorite === 'true') query.favorite = true;
    if (pinned === 'true') query.pinned = true;

    // By default, hide archived notes unless explicitly requested
    if (archived === 'true') {
      query.archived = true;
    } else {
      query.archived = false;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { pinned: -1, updatedAt: -1 };
    if (sort === 'oldest') sortOption = { pinned: -1, createdAt: 1 };
    if (sort === 'newest') sortOption = { pinned: -1, createdAt: -1 };
    if (sort === 'az') sortOption = { pinned: -1, title: 1 };
    if (sort === 'za') sortOption = { pinned: -1, title: -1 };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const [notes, total] = await Promise.all([
      Note.find(query)
        .populate('category', 'name color')
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Note.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      notes,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
const getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id, deleted: false }).populate(
      'category',
      'name color'
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Create note
// @route   POST /api/notes
const createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, content, category, color } = req.body;
    const note = await Note.create({
      userId: req.user._id,
      title,
      content,
      category: category || null,
      color: color || '#FAF7F2',
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id, deleted: false });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    const { title, content, category, color } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category || null;
    if (color !== undefined) note.color = color;

    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete note (move to trash)
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.deleted = true;
    note.deletedAt = new Date();
    await note.save();

    res.status(200).json({ success: true, message: 'Note moved to trash' });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore deleted note
// @route   PATCH /api/notes/restore/:id
const restoreNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id, deleted: true });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found in trash' });

    note.deleted = false;
    note.deletedAt = null;
    await note.save();

    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Get deleted (trashed) notes
// @route   GET /api/notes/trash/all
const getTrash = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user._id, deleted: true }).sort({ deletedAt: -1 });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete note
// @route   DELETE /api/notes/permanent/:id
const permanentlyDeleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id, deleted: true });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found in trash' });
    res.status(200).json({ success: true, message: 'Note permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin
// @route   PATCH /api/notes/pin/:id
const togglePin = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id, deleted: false });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    note.pinned = !note.pinned;
    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle archive
// @route   PATCH /api/notes/archive/:id
const toggleArchive = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id, deleted: false });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    note.archived = !note.archived;
    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite
// @route   PATCH /api/notes/favorite/:id
const toggleFavorite = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id, deleted: false });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    note.favorite = !note.favorite;
    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate note
// @route   POST /api/notes/duplicate/:id
const duplicateNote = async (req, res, next) => {
  try {
    const original = await Note.findOne({ _id: req.params.id, userId: req.user._id, deleted: false });
    if (!original) return res.status(404).json({ success: false, message: 'Note not found' });

    const copy = await Note.create({
      userId: req.user._id,
      title: `${original.title} (Copy)`,
      content: original.content,
      category: original.category,
      color: original.color,
    });

    res.status(201).json({ success: true, note: copy });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/notes/stats/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalNotes, favoriteNotes, archivedNotes, pinnedNotes, byCategory, recentNotes, pinnedList] =
      await Promise.all([
        Note.countDocuments({ userId, deleted: false }),
        Note.countDocuments({ userId, favorite: true, deleted: false }),
        Note.countDocuments({ userId, archived: true, deleted: false }),
        Note.countDocuments({ userId, pinned: true, deleted: false }),
        Note.aggregate([
          { $match: { userId, deleted: false, category: { $ne: null } } },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          {
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'categoryInfo',
            },
          },
          { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 0,
              category: '$categoryInfo.name',
              color: '$categoryInfo.color',
              count: 1,
            },
          },
        ]),
        Note.find({ userId, deleted: false }).sort({ updatedAt: -1 }).limit(5),
        Note.find({ userId, deleted: false, pinned: true }).sort({ updatedAt: -1 }).limit(6),
      ]);

    // Monthly notes created (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAgg = await Note.aggregate([
      { $match: { userId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyNotes = monthlyAgg.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      count: m.count,
    }));

    res.status(200).json({
      success: true,
      stats: { totalNotes, favoriteNotes, archivedNotes, pinnedNotes },
      byCategory,
      monthlyNotes,
      recentNotes,
      pinnedNotes: pinnedList,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
