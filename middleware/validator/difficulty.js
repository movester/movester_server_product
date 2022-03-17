const { body } = require('express-validator');

const difficulty = [
  body('stretchingIdx', 'stretchingIdx는 숫자여야 합니다.').notEmpty().isInt().toInt(),
  body('difficulty', 'difficulty 1~5 사이 정수여야 합니다.').notEmpty().isInt({ min: 1, max: 5 }).toInt(),
];

module.exports = {
  difficulty,
};
