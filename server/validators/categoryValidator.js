const { body } = require('express-validator');

const categoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 40 }),
  body('color').optional({ checkFalsy: true }).isString(),
];

module.exports = { categoryValidator };
