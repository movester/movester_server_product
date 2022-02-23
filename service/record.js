const recordDao = require('../dao/record');
const { getToday } = require('../utils/getToday');

const createRecord = async (userIdx, type, record) => {
  try {
    const { year, month } = getToday();
    await recordDao.createRecord(userIdx, type, record, year, month);
  } catch (err) {
    console.error(`=== Record Service createRecord Error: ${err} === `);
    throw new Error(err);
  }
};

const isOverlapRecord = async (userIdx, type) => {
  try {
    const recentRecord = await recordDao.findRecentRecord(userIdx, type);
    if (!recentRecord) return false;

    const [lastYear, lastMonth, lastDate] = recentRecord.split(' ');

    const { year, month, date } = getToday();

    return +lastYear === year && +lastMonth === month && +lastDate === date;
  } catch (err) {
    console.error(`=== Record Service isOverlapRecord Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createRecord,
  isOverlapRecord,
};
