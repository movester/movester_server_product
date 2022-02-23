const getToday = () => {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
  };
};

const getLastDateOfMonth = (year, month) => new Date(year, month, 0).getDate();

const isValidDate = (year, month, date) => date <= getLastDateOfMonth(year, month);

const lPad = num => (num < 10 ? `0${num}` : num);

module.exports = {
  getToday,
  getLastDateOfMonth,
  isValidDate,
  lPad,
};
