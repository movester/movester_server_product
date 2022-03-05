const weekService = require('../service/week');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const getExposedWeek = async (req, res) => {
  try {
    const week = await weekService.getExposedWeek();
    return res.status(CODE.OK).json(form.success(week));
  } catch (err) {
    console.error(`=== Week Ctrl getExposedWeek Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  getExposedWeek,
};
