const likeDao = require('../dao/like');

const findLikeByUserIdxAndStretchingIdx = async (userIdx, stretchingIdx) => {
  try {
    const like = await likeDao.findLikeByUserIdxAndStretchingIdx(userIdx, stretchingIdx);
    return like;
  } catch (err) {
    console.error(`=== Like Service createLike Error: ${err} === `);
    throw new Error(err);
  }
};

const createLike = async (userIdx, stretchingIdx) => {
  try {
    const isDuplicate = await findLikeByUserIdxAndStretchingIdx(userIdx, stretchingIdx);
    if (isDuplicate) return false;

    const newLikeIdx = await likeDao.createLike(userIdx, stretchingIdx);
    return newLikeIdx;
  } catch (err) {
    console.error(`=== Like Service createLike Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  findLikeByUserIdxAndStretchingIdx,
  createLike,
};
