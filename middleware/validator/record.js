const { query, body, param } = require('express-validator');

const checkQueryType = [
  query('type')
    .notEmpty()
    .withMessage('기록 종류를 입력해주세요.')
    .isInt({ min: 1, max: 2 })
    .withMessage('1 혹은 2 사이의 숫자여야합니다.')
    .toInt(),
];

const checkQueryRecord = [
  query('record')
    .notEmpty()
    .withMessage('기록 종류를 입력해주세요.')
    .isFloat({ min: -15, max: 40 })
    .withMessage('-15 ~ 40 사이의 숫자여야합니다.')
    .toFloat(),
];

const checkBodyType = [
  body('type')
    .notEmpty()
    .withMessage('기록 종류를 입력해주세요.')
    .isInt({ min: 1, max: 2 })
    .withMessage('1 혹은 2 사이의 숫자여야합니다.')
    .toInt(),
];

const checkBodyRecord = [
  body('record')
    .notEmpty()
    .withMessage('기록 종류를 입력해주세요.')
    .isFloat({ min: -15, max: 40 })
    .withMessage('-15 ~ 40 사이의 숫자여야합니다.')
    .toFloat(),
];

const checkParamType = [
  param('type')
    .notEmpty()
    .withMessage('기록 종류를 입력해주세요.')
    .isInt({ min: 1, max: 2 })
    .withMessage('1 혹은 2 사이의 숫자여야합니다.')
    .toInt(),
];

module.exports = {
  checkQueryType,
  checkQueryRecord,
  checkBodyType,
  checkBodyRecord,
  checkParamType
};
