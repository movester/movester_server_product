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
    const recentAttendPoint = await attendPointDao.findRecentAttendPoint(userIdx, year, month);
    if (!recentAttendPoint) return false;

    const [lastYear, lastMonth, lastDate] = recentAttendPoint.split(' ');
    return +lastYear === year && +lastMonth === month && +lastDate === date;
  } catch (err) {
    console.error(`=== User Service createAttendPoint Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createAttendPoint,
  isOverlapAttendPoint,
};
