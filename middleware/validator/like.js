const { body } = require('express-validator');

const create = [body('stretchingIdx', 'stretchingIdx 숫자로만 이루어져야 합니다.').notEmpty().isInt().toInt()];

module.exports = {
  create,
};
