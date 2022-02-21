const attendPointService = require('../service/attendPoint');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const createAttendPoint = async (req, res) => {
  try {
    const { userIdx } = req.cookies;

    const isOverlapAttendPoint = await attendPointService.isOverlapAttendPoint(userIdx);
    if (isOverlapAttendPoint) return res.status(CODE.BAD_REQUEST).json(form.fail("이미 당일 출석 포인트를 적립하였습니다."));

    await attendPointService.createAttendPoint(userIdx);
    return res.status(CODE.OK).json(form.success());
  } catch (err) {
    console.error(`=== AttendPoint Ctrl createAttendPoint Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createAttendPoint,
};