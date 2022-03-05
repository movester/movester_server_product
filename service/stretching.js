const stretchingDao = require('../dao/stretching');

const findStretchingByIdx = async (idx) => {
  try {
    const stretching = await stretchingDao.findStretchingByIdx(idx);
    return stretching
  } catch (err) {
    console.error(`=== Stretching Service findStretchingByIdx Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  findStretchingByIdx,
};