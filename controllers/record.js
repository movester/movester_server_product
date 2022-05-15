const recordService = require('../service/record');
const CODE = require('../utils/statusCode');
const form = require('../utils/responseForm');
const { isValidDate } = require('../utils/getToday');

const createRecord = async (req, res) => {
  const { userIdx } = req.cookies;
  const { type, record } = req.body;

  const isOverlapRecord = await recordService.isOverlapRecord(userIdx, type);
  if (isOverlapRecord) return res.status(CODE.BAD_REQUEST).json(form.fail('이미 당일 해당 부위를 기록하였습니다.'));

  await recordService.createRecord(userIdx, type, record);
  return res.status(CODE.CREATED).json(form.success());
};

const updateRecord = async (req, res) => {
  const { userIdx } = req.cookies;
  const { type, record } = req.body;

  const updateRecord = await recordService.updateRecord(userIdx, type, record);
  if (!updateRecord) return res.status(CODE.BAD_REQUEST).json(form.fail('당일 해당 부위 기록 내역이 없습니다.'));

  return res.status(CODE.OK).json(form.success());
};

const deleteRecord = async (req, res) => {
  const { userIdx } = req.cookies;
  const { type } = req.params;

  const isDeleteRecord = await recordService.deleteRecord(userIdx, type);
  if (!isDeleteRecord) return res.status(CODE.BAD_REQUEST).json(form.fail('당일 해당 부위 기록 내역이 없습니다.'));

  return res.status(CODE.OK).json(form.success());
};

const getGraphRecords = async (req, res) => {
  const { userIdx } = req.cookies;
  const { type } = req.params;

  const records = await recordService.getGraphRecords(userIdx, type);

  return res.status(CODE.OK).json(form.success(records));
};

const getRecords = async (req, res) => {
  const { userIdx } = req.cookies;
  const { type } = req.params;

  const records = await recordService.getRecords(userIdx, type);

  return res.status(CODE.OK).json(form.success(records));
};

const getSearchRecords = async (req, res) => {
  const { userIdx } = req.cookies;
  const { type } = req.params;
  const date = req.query;

  const isValidStartDate = isValidDate(date.startYear, date.startMonth, date.startDate);
  const isValidEndDate = isValidDate(date.endYear, date.endMonth, date.endDate);

  if (!isValidStartDate || !isValidEndDate)
    return res.status(CODE.BAD_REQUEST).json(form.fail('유효한 날짜값이 아닙니다.'));

  const records = await recordService.getSearchRecords(userIdx, type, date);

  return res.status(CODE.OK).json(form.success(records));
};

module.exports = {
  createRecord,
  updateRecord,
  deleteRecord,
  getRecords,
  getSearchRecords,
  getGraphRecords,
};
