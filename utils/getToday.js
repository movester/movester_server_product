// 현재 year, month, date 담긴 객체 반환
const getToday = () => {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
  };
};

// year년, month월의 마지말 날짜 반환 (int)
const getLastDateOfMonth = (year, month) => new Date(year, month, 0).getDate();

// year년, month월, date일이 유효한 날짜인지를 반환 (boolean)
const isValidDate = (year, month, date) => date <= getLastDateOfMonth(year, month);

// num이 1자리수 인 경우, 0+num으로 출력 (ex) 1 > 01)
const lPad = num => (num < 10 ? `0${num}` : num);

module.exports = {
  getToday,
  getLastDateOfMonth,
  isValidDate,
  lPad,
};
