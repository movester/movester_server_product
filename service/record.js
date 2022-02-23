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
    const { year, month, date } = getToday();
    const isOverlapRecord = await recordDao.findTodayRecord(userIdx, type, year, month, date);
    return isOverlapRecord;
  } catch (err) {
    console.error(`=== Record Service isOverlapRecord Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createRecord,
  isOverlapRecord,
};
