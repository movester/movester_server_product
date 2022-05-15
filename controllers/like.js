const likeService = require('../service/like');
const stretchingService = require('../service/stretching');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const createLike = async (req, res) => {
  const { userIdx } = req.cookies;
  const { stretchingIdx } = req.body;

  const isValidStretching = await stretchingService.findStretchingByIdx(stretchingIdx);
  if (!isValidStretching) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

  const likeIdx = await likeService.createLike(userIdx, stretchingIdx);
  if (!likeIdx) return res.status(CODE.DUPLICATE).json(form.fail('이미 등록된 찜입니다.'));

  return res.status(CODE.CREATED).json(form.success({ likeIdx }));
};

const deleteLike = async (req, res) => {
  const { userIdx } = req.cookies;
  const stretchingIdx = req.params.idx;

  const isDelete = await likeService.deleteLike(userIdx, stretchingIdx);
  if (!isDelete) return res.status(CODE.BAD_REQUEST).json(form.fail(MSG.IDX_NOT_EXIST));

  return res.status(CODE.OK).json(form.success());
};

const getLikes = async (req, res) => {
  const { userIdx } = req.cookies;

  const likes = await likeService.getLikes(userIdx);

  return res.status(CODE.OK).json(form.success(likes));
};

module.exports = {
  createLike,
  deleteLike,
  getLikes,
};
