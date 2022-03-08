const stretchingDao = require('../dao/stretching');

const makeNullToEmptyStr = str => (str === '' ? "''" : str);
const getNullToEmptyStr = str => (!str ? str : str.split(' '));

const findStretchingByIdx = async idx => {
  try {
    const stretching = await stretchingDao.findStretchingByIdx(idx);
    return stretching;
  } catch (err) {
    console.error(`=== Stretching Service findStretchingByIdx Error: ${err} === `);
    throw new Error(err);
  }
};

const getStretchings = async (searchType, main, sub, userIdx) => {
  try {
    let stretchings;

    searchType = makeNullToEmptyStr(searchType);
    main = makeNullToEmptyStr(main);
    sub = makeNullToEmptyStr(sub);

    switch (searchType) {
      case 1:
        stretchings = await stretchingDao.getStretchingsByBodypart(main, sub, userIdx);
        break;
      case 2:
        stretchings = await stretchingDao.getStretchingsByPosture(main, userIdx);
        break;
      case 3:
        stretchings = await stretchingDao.getStretchingsByEffect(main, userIdx);
        break;
    }

    const managedStretchings = stretchings.map(stretching => {
      stretching.effect = getNullToEmptyStr(stretching.effect);
      stretching.posture = getNullToEmptyStr(stretching.posture);
      return stretching;
    });

    return managedStretchings;
  } catch (err) {
    console.error(`=== Stretching Service getStretchings Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  findStretchingByIdx,
  getStretchings,
};
