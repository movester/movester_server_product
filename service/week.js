const weekDao = require('../dao/week');

const getExposedWeek = async () => {
  try {
    const week = await weekDao.getExposedWeek();
    if (!week) return week;

    const weekStretching = week.reduce((acc, { weekDay, image }) => {
      acc[weekDay] = image;
      return acc;
    }, []);
    
    return weekStretching;
  } catch (err) {
    console.error(`=== Week Service getExposedWeek Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  getExposedWeek,
};
