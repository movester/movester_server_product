const { param , body} = require('express-validator');

const checkParamIdx = [param('idx', 'idx 는 숫자로만 이루어져야 합니다.').isInt().toInt()];
const checkbodyIdx = [body('idx', 'idx 는 숫자로만 이루어져야 합니다.').isInt().toInt()];

module.exports = {
  checkParamIdx,
  checkbodyIdx,
};
