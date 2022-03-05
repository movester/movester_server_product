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

const deleteLike = async likeIdx => {
  try {
    const isDelete = await likeDao.deleteLike(likeIdx);
    return isDelete;
  } catch (err) {
    console.error(`=== Like Service deleteLike Error: ${err} === `);
    throw new Error(err);
  }
};

const getLikes = async userIdx => {
  try {
    const likes = await likeDao.getLikes(userIdx);

    const managedLikes = likes.map(like => {
      if (like.effects) {
        like.effects = like.effects.split(' ').map(v => +v);
      }
      if (like.postures) {
        like.postures = like.postures.split(' ').map(v => +v);
      }
      return like;
    });

    return managedLikes;
  } catch (err) {
    console.error(`=== Like Service getLikes Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  findLikeByUserIdxAndStretchingIdx,
  createLike,
  deleteLike,
  getLikes,
};
