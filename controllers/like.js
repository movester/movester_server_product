const likeService = require('../service/like');
const stretchingService = require('../service/stretching');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const createLike = async (req, res) => {
  try {
    const { userIdx } = req.cookies;
    const { stretchingIdx } = req.body;

    const isValidStretching = await stretchingService.findStretchingByIdx(stretchingIdx);
    if (!isValidStretching) return res.status(CODE.NOT_FOUND).json(form.fail(MSG.IDX_NOT_EXIST));

    const likeIdx = await likeService.createLike(userIdx, stretchingIdx);
    if (!likeIdx) return res.status(CODE.DUPLICATE).json(form.fail('이미 존재하는 찜입니다.'));

    return res.status(CODE.CREATED).json(form.success({ likeIdx }));
  } catch (err) {
    console.error(`=== Like Ctrl createLike Error: ${err} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  createLike,
};
