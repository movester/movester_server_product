const attendPointDao = require('../dao/attendPoint');

const createAttendPoint = async userIdx => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    await attendPointDao.createAttendPoint(userIdx, year, month);
  } catch (err) {
    console.error(`=== AttendPoint Service createAttendPoint Error: ${err} === `);
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
    console.error(`=== AttendPoint Service isOverlapAttendPoint Error: ${err} === `);
    throw new Error(err);
  }
};

const getAttendPoints = async (userIdx, year, month) => {
  try {
    const lastDay = new Date(year, month - 1, 0).getDate();
    const monthArray = new Array(lastDay).fill(0);

    const attendPoints = await attendPointDao.getAttendPointsByYearMonth(userIdx, year, month);

    attendPoints.forEach(attendPoint => {
      monthArray[+attendPoint.day - 1] = 1;
    });

    return monthArray;
  } catch (err) {
    console.error(`=== AttendPoint Service getAttendPoints Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createAttendPoint,
  isOverlapAttendPoint,
  getAttendPoints,
};
