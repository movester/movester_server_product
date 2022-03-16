const weekDao = require('../dao/week');

const getExposedWeek = async () => {
  try {
    const week = await weekDao.getExposedWeek();
    if (!week) return week;

    const managedWeek = {
      weekIdx: week.weekIdx,
      title: week.title,
      stretchings: [week.mon, week.tue, week.wed, week.thu, week.fri, week.sat, week.sun],
    };

    return managedWeek;
  } catch (err) {
    console.error(`=== Week Service getExposedWeek Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  getExposedWeek,
};
