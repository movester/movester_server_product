const weekService = require('../service/week');
const CODE = require('../utils/statusCode');
const form = require('../utils/responseForm');

const getExposedWeek = async (req, res) => {
  const week = await weekService.getExposedWeek();
  return res.status(CODE.OK).json(form.success(week));
};

module.exports = {
  getExposedWeek,
};
