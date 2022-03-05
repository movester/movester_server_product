const difficultyService = require('../service/difficulty');
const stretchingService = require('../service/stretching');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const createDifficulty = async (req, res) => {
  try {
    const { userIdx } = req.cookies;
    const { stretchingIdx, difficulty } = req.body;

    const isValidStretching = await stretchingService.findStretchingByIdx(stretchingIdx);
    if (!isValidStretching) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    const isCreate = await difficultyService.createDifficulty(userIdx, stretchingIdx, difficulty);
    if (!isCreate) return res.status(CODE.BAD_REQUEST).json(form.fail('이미 해당 스트레칭을 평가하였습니다.'));

    return res.status(CODE.CREATED).json(form.success());
  } catch (err) {
    console.error(`=== Difficulty Ctrl createDifficulty Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createDifficulty,
};
