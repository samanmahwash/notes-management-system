const { body } = require('express-validator');

const noteValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').optional({ checkFalsy: true }).isString(),
  body('category').optional({ nullable: true }).isMongoId().withMessage('Invalid category id'),
  body('color').optional({ checkFalsy: true }).isString(),
];

module.exports = { noteValidator };
