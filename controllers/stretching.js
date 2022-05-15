const stretchingService = require('../service/stretching');
const userService = require('../service/user');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const getStretchings = async (req, res) => {
  const { searchType, main, sub, userIdx, page } = req.query;

  if (userIdx) {
    const isValidUser = await userService.findUserByIdx(userIdx);
    if (!isValidUser) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.IDX_NOT_EXIST));
    }
  }

  const stretchings = await stretchingService.getStretchings(+searchType, main, sub, userIdx, page);
  return res.status(CODE.OK).json(form.success(stretchings));
};

const getStretching = async (req, res) => {
  const stretchingIdx = req.params.idx;
  const { userIdx } = req.query;

  if (userIdx) {
    const isValidUser = await userService.findUserByIdx(userIdx);
    if (!isValidUser) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.IDX_NOT_EXIST));
    }
  }

  const stretching = await stretchingService.getStretching(stretchingIdx, userIdx);
  if (!stretching) {
    return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));
  }

  return res.status(CODE.OK).json(form.success(stretching));
};

const getTagStretchings = async (req, res) => {
  const tag = {
    main: JSON.parse(req.query.main),
    sub: JSON.parse(req.query.sub),
    tool: JSON.parse(req.query.tool),
    effect: JSON.parse(req.query.effect),
    posture: JSON.parse(req.query.posture),
  };

  const { userIdx } = req.query;

  if (userIdx) {
    const isValidUser = await userService.findUserByIdx(userIdx);
    if (!isValidUser) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.IDX_NOT_EXIST));
    }
  }

  const stretchings = await stretchingService.getTagStretchings(tag, userIdx);

  return res.status(CODE.OK).json(form.success(stretchings));
};

const getRecommendStretchings = async (req, res) => {
  const stretchingIdx = req.params.idx;
  const { userIdx } = req.query;

  if (userIdx) {
    const isValidUser = await userService.findUserByIdx(userIdx);
    if (!isValidUser) {
      return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.IDX_NOT_EXIST));
    }
  }

  const stretchings = await stretchingService.getRecommendStretchings(stretchingIdx, userIdx);

  return res.status(CODE.OK).json(form.success(stretchings));
};

module.exports = {
  getStretchings,
  getStretching,
  getTagStretchings,
  getRecommendStretchings,
};
