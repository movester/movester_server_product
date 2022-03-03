const { query, body, param } = require('express-validator');
const { getToday } = require('../../utils/getToday');

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

const checkQueryDate = [
  query('startYear')
    .notEmpty()
    .withMessage('날짜를 정확히 입력해주세요.')
    .isInt({ min: 2021, max: getToday().year })
    .withMessage('날짜를 정확히 입력해주세요.')
    .toInt(),
  query('startMonth')
    .notEmpty()
    .withMessage('날짜를 정확히 입력해주세요.')
    .isInt({ min: 1, max: 12 })
    .withMessage('날짜를 정확히 입력해주세요.')
    .toInt(),
  query('startDate')
    .notEmpty()
    .withMessage('날짜를 정확히 입력해주세요.')
    .isInt({ min: 1, max: 31 })
    .withMessage('날짜를 정확히 입력해주세요.')
    .toInt(),
  query('endYear')
    .notEmpty()
    .withMessage('날짜를 정확히 입력해주세요.')
    .isInt({ min: 1, max: getToday().year })
    .withMessage('날짜를 정확히 입력해주세요.')
    .toInt(),
  query('endMonth')
    .notEmpty()
    .withMessage('날짜를 정확히 입력해주세요.')
    .isInt({ min: 1, max: 12 })
    .withMessage('날짜를 정확히 입력해주세요.')
    .toInt(),
  query('endDate')
    .notEmpty()
    .withMessage('날짜를 정확히 입력해주세요.')
    .isInt({ min: 1, max: 31 })
    .withMessage('날짜를 정확히 입력해주세요.')
    .toInt(),
];

module.exports = {
  checkQueryType,
  checkQueryRecord,
  checkBodyType,
  checkBodyRecord,
  checkParamType,
  checkQueryDate,
};
