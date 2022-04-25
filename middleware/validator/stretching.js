const { query } = require('express-validator');

const getStretchings = [
  query('searchType', 'searchType는 숫자로 이루어져야합니다.').exists().isInt({ min: 1, max: 3 }).toInt(),
  query('main', 'main는 숫자로 이루어져야합니다.').custom(v => v === '' || v.match(/^[1-9]/)),
  query('sub', 'sub는 숫자로 이루어져야합니다.').custom(v => v === '' || v.match(/^[1-9]/)),
  query('page', 'page는 숫자로 이루어져야합니다.').custom(v => v === '' || v.match(/^[1-9]/)),
];

const getTagStretchings = [
  query('main', 'main은 배열로 이루어져야합니다.').isArray(),
  query('sub', 'sub은 배열로 이루어져야합니다.').isArray(),
  query('posture', 'posture은 배열로 이루어져야합니다.').isArray(),
  query('effect', 'effect은 배열로 이루어져야합니다.').isArray(),
  query('tool', 'tool은 배열로 이루어져야합니다.').isArray(),
];

module.exports = {
  getStretchings,
  getTagStretchings,
};
