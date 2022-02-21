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
    return res.status(CODE.CREATED).json(form.success());
  } catch (err) {
    console.error(`=== AttendPoint Ctrl createAttendPoint Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

const getAttendPoints = async (req, res) => {
  try {
    const { userIdx } = req.cookies;
    const { year, month} = req.query;

    const attendPoints = await attendPointService.getAttendPoints(userIdx, year, month);
    return res.status(CODE.OK).json(form.success(attendPoints));
  } catch (err) {
    console.error(`=== AttendPoint Ctrl getAttendPoints Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createAttendPoint,
  getAttendPoints
};