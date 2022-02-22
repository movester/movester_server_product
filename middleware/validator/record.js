const { query } = require('express-validator');

const checkType = [
  query('type')
    .notEmpty()
    .withMessage('기록 종류를 입력해주세요.')
    .isInt({ min: 1, max: 2 })
    .withMessage('1 혹은 2 사이의 숫자여야합니다.')
    .toInt(),
];

const checkRecord = [
  query('record')
    .notEmpty()
    .withMessage('기록 종류를 입력해주세요.')
    .isFloat({ min: -20, max: 40 })
    .withMessage('-20 ~ 40 사이의 숫자여야합니다.')
    .toFloat(),
];

module.exports = {
  checkType,
  checkRecord
};
