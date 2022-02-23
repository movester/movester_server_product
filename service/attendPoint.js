const attendPointDao = require('../dao/attendPoint');
const { getToday } = require('../utils/getToday');

const createAttendPoint = async userIdx => {
  try {
    const { year, month } = getToday();
    await attendPointDao.createAttendPoint(userIdx, year, month);
  } catch (err) {
    console.error(`=== User Service createAttendPoint Error: ${err} === `);
    throw new Error(err);
  }
};

const isOverlapAttendPoint = async userIdx => {
  try {
    const { year, month, date } = getToday();
    const isOverlapAttendPoint = await attendPointDao.findAttendPointByDate(userIdx, year, month, date);
    return isOverlapAttendPoint;
  } catch (err) {
    console.error(`=== User Service createAttendPoint Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createAttendPoint,
  isOverlapAttendPoint,
};
