const attendPointDao = require('../dao/attendPoint');

const createAttendPoint = async userIdx => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    await attendPointDao.createAttendPoint(userIdx, year, month);
  } catch (err) {
    console.error(`=== User Service createAttendPoint Error: ${err} === `);
    throw new Error(err);
  }
};

const isOverlapAttendPoint = async userIdx => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const recentAttendPoint = await attendPointDao.findRecentAttendPoint(userIdx, year, month);
    if (!recentAttendPoint) return false;

    const [lastYear, lastMonth, lastDay] = recentAttendPoint.split(' ');

    return +lastYear === year && +lastMonth === month && +lastDay === day;
  } catch (err) {
    console.error(`=== User Service createAttendPoint Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createAttendPoint,
  isOverlapAttendPoint,
};
