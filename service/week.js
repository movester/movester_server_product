const weekDao = require('../dao/week');

const getExposedWeek = async () => {
  try {
    const week = await weekDao.getExposedWeek();
    return week;
  } catch (err) {
    console.error(`=== Week Service getExposedWeek Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  getExposedWeek,
};
