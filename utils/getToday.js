const getToday = () => {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
  };
};

const lPad = num => (num < 10 ? `0${num}` : num);

module.exports = {
  getToday,
  lPad
};
