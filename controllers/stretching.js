const stretchingService = require('../service/stretching');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const getStretchings = async (req, res) => {
  try {
    const { searchType, main, sub } = req.query;

    const stretchings = await stretchingService.getStretchings(+searchType, main, sub);
    return res.status(CODE.OK).json(form.success(stretchings));
  } catch (err) {
    console.error(`=== Stretching Ctrl getStretchings Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getStretching = async (req, res) => {
  try {
    const stretchingIdx = req.params.idx;

    const stretching = await stretchingService.getStretching(stretchingIdx);
    if (!stretching) {
      return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
    }

    return res.status(CODE.OK).json(form.success(stretching));
  } catch (err) {
    console.error(`=== Stretching Ctrl getStretching Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  getStretchings,
  getStretching,
};
