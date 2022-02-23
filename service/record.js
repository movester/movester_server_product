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
    return !!deleteRecord.affectedRows;
  } catch (err) {
    console.error(`=== Record Service deleteRecord Error: ${err} === `);
    throw new Error(err);
  }
};

const getSummaryRecords = async userIdx => {
  try {
    const summaryRecords = await recordDao.getSummaryRecords(userIdx);
    const records = summaryRecords.reduce((acc, { type, record, date }) => {
      if (!acc[type]) acc[type] = [];
      acc[type] = [...acc[type], { record, date }];
      return acc;
    }, {});

    return { shoulder: records[1], leg: records[2] };
  } catch (err) {
    console.error(`=== Record Service getSummaryRecords Error: ${err} === `);
    throw new Error(err);
  }
};

const getRecords = async (userIdx, type) => {
  try {
    const records = await recordDao.getRecords(userIdx, type);
    return records;
  } catch (err) {
    console.error(`=== Record Service getRecords Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createRecord,
  isOverlapRecord,
  updateRecord,
  deleteRecord,
  getSummaryRecords,
  getRecords,
};
