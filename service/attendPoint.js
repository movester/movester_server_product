const attendPointDao = require('../dao/attendPoint');
const { getToday } = require('../utils/getToday');

const createAttendPoint = async userIdx => {
  try {
    const { year, month } = getToday();
    await attendPointDao.createAttendPoint(userIdx, year, month);
  } catch (err) {
    console.error(`=== AttendPoint Service createAttendPoint Error: ${err} === `);
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
    console.error(`=== AttendPoint Service isOverlapAttendPoint Error: ${err} === `);
    throw new Error(err);
  }
};

const getAttendPoints = async (userIdx, year, month) => {
  try {
    const lastDateOfMonth = new Date(year, month - 1, 0).getDate();
    const monthArray = new Array(lastDateOfMonth).fill(0);

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
