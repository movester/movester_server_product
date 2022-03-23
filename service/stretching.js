const stretchingDao = require('../dao/stretching');

const makeNullToEmptyStr = str => (str === '' ? "''" : str);
const makeStringToArray = str => (!str ? str : str.split(' '));

const findStretchingByIdx = async idx => {
  try {
    const stretching = await stretchingDao.findStretchingByIdx(idx);
    return stretching;
  } catch (err) {
    console.error(`=== Stretching Service findStretchingByIdx Error: ${err} === `);
    throw new Error(err);
  }
};

const getStretchings = async (searchType, main, sub) => {
  try {
    let stretchings;

    searchType = makeNullToEmptyStr(searchType);
    main = makeNullToEmptyStr(main);
    sub = makeNullToEmptyStr(sub);

    switch (searchType) {
      case 1:
        stretchings = await stretchingDao.getStretchingsByBodypart(main, sub);
        break;
      case 2:
        stretchings = await stretchingDao.getStretchingsByPosture(main);
        break;
      case 3:
        stretchings = await stretchingDao.getStretchingsByEffect(main);
        break;
    }

    const managedStretchings = stretchings.map(stretching => {
      stretching.effect = makeStringToArray(stretching.effect);
      stretching.posture = makeStringToArray(stretching.posture);
      return stretching;
    });

    return managedStretchings;
  } catch (err) {
    console.error(`=== Stretching Service getStretchings Error: ${err} === `);
    throw new Error(err);
  }
};

const getStretching = async (stretchingIdx, userIdx) => {
  try {
    const stretching = await stretchingDao.getStretching(stretchingIdx, userIdx);
    if (stretching) {
      stretching.effect = makeStringToArray(stretching.effect);
      stretching.posture = makeStringToArray(stretching.posture);
      stretching.difficulty = +Number(stretching.difficulty).toFixed(2);
    }
    return stretching;
  } catch (err) {
    console.error(`=== Stretching Service getStretching Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  findStretchingByIdx,
  getStretchings,
  getStretching,
};