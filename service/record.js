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

const updateRecord = async (userIdx, type, record) => {
  try {
    const updateRecord = await recordDao.updateRecord(userIdx, type, record);
    return !!updateRecord.affectedRows;
  } catch (err) {
    console.error(`=== Record Service updateRecord Error: ${err} === `);
    throw new Error(err);
  }
};

const deleteRecord = async (userIdx, type) => {
  try {
    const deleteRecord = await recordDao.deleteRecord(userIdx, type);
    return !!deleteRecord.affectedRows
  } catch (err) {
    console.error(`=== Record Service deleteRecord Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createRecord,
  isOverlapRecord,
  updateRecord,
  deleteRecord
};