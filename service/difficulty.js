const difficultyDao = require('../dao/difficulty');

const createDifficulty = async (userIdx, stretchingIdx, difficulty) => {
  try {
    const isDuplicate = await difficultyDao.findDifficultyByUserIdxAndStretchingIdx(userIdx, stretchingIdx);
    if (isDuplicate) return false;

    const difficultyIdx = await difficultyDao.createDifficulty(userIdx, stretchingIdx, difficulty);
    return difficultyIdx;
  } catch (err) {
    console.error(`=== Difficulty Service createDifficulty Error: ${err} === `);
    throw new Error(err);
  }
};

const deleteDifficulty = async difficultyIdx => {
  try {
    const isDelete = await difficultyDao.deleteDifficulty(difficultyIdx);
    return isDelete;
  } catch (err) {
    console.error(`=== Difficulty Service deleteDifficulty Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createDifficulty,
  deleteDifficulty,
};
