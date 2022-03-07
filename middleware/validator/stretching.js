const { query } = require('express-validator');

const getStretchings = [
  query('searchType', 'searchType는 숫자로 이루어져야합니다.').exists().isInt({ min: 1, max: 3 }).toInt(),
  query('main', 'main는 숫자로 이루어져야합니다.').custom(v => v === '' || v.match(/^[1-5]/)),
  query('sub', 'sub는 숫자로 이루어져야합니다.').custom(v => v === '' || v.match(/^[1-5]/)),
];

module.exports = {
  getStretchings,
};
