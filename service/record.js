const recordDao = require('../dao/record');

const createRecord = async (userIdx, type, record) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
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

    const [lastYear, lastMonth, lastDay] = recentRecord.split(' ');

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return +lastYear === year && +lastMonth === month && +lastDay === day;
  } catch (err) {
    console.error(`=== Record Service isOverlapRecord Error: ${err} === `);
    throw new Error(err);
  }
};

const isExistCurRecord = async (userIdx, type) => {
  try {
    const isExistCurRecord = await recordDao.isExistCurRecord(userIdx, type);
    return !!isExistCurRecord;
  } catch (err) {
    console.error(`=== Record Service isExistCurRecord Error: ${err} === `);
    throw new Error(err);
  }
};

const updateRecord = async (userIdx, type, record) => {
  try {
    await recordDao.updateRecord(userIdx, type, record);
  } catch (err) {
    console.error(`=== Record Service updateRecord Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createRecord,
  isOverlapRecord,
  isExistCurRecord,
  updateRecord,
};
