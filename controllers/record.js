const recordService = require('../service/record');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const createRecord = async (req, res) => {
  try {
    const { userIdx } = req.cookies;
    const { type, record } = req.body;

    const isOverlapRecord = await recordService.isOverlapRecord(userIdx, type);
    if (isOverlapRecord) return res.status(CODE.BAD_REQUEST).json(form.fail("이미 당일 해당 부위를 기록하였습니다."));

    await recordService.createRecord(userIdx, type, record);
    return res.status(CODE.CREATED).json(form.success());
  } catch (err) {
    console.error(`=== Record Ctrl createRecord Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createRecord,
};
