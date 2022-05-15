const attendPointService = require('../service/attendPoint');
const CODE = require('../utils/statusCode');
const form = require('../utils/responseForm');

const createAttendPoint = async (req, res) => {
  const { userIdx } = req.cookies;

  const isDuplicateAttendPoint = await attendPointService.isDuplicateAttendPoint(userIdx);
  if (isDuplicateAttendPoint)
    return res.status(CODE.BAD_REQUEST).json(form.fail('이미 당일 출석 포인트를 적립하였습니다.'));

  await attendPointService.createAttendPoint(userIdx);
  return res.status(CODE.CREATED).json(form.success());
};

const getAttendPoints = async (req, res) => {
  const { userIdx } = req.cookies;
  const { year, month } = req.query;

  const attendPoints = await attendPointService.getAttendPoints(userIdx, year, month);
  return res.status(CODE.OK).json(form.success(attendPoints));
};

module.exports = {
  createAttendPoint,
  getAttendPoints,
};
