const { query } = require('express-validator');

const checkYearMonth = [
  query('year')
    .notEmpty()
    .withMessage('연도를 입력해주세요.')
    .isInt({ min: 2021, max: 2022 })
    .withMessage('2021 ~ 2022 사이의 숫자여야합니다.')
    .toInt(),
  query('month')
    .notEmpty()
    .withMessage('달을 입력해주세요.')
    .isInt({ min: 1, max: 12 })
    .withMessage('1 ~ 12 사이의 숫자여야합니다.')
    .toInt(),
];

module.exports = {
  checkYearMonth,
};
