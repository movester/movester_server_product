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
    const isOverlapRecord = await recordDao.findRecordByDate(userIdx, type, year, month, date);
    return isOverlapRecord;
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

const getGraphRecords = async (userIdx, type) => {
  try {
    const records = await recordDao.getGraphRecords(userIdx, type);
    return records
  } catch (err) {
    console.error(`=== Record Service getGraphRecords Error: ${err} === `);
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
  getGraphRecords,
  getRecords,
};
