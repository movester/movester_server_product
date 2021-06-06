const userDao = require("../dao/user");

const test = async () => {
  const row = await userDao.test();
  return row;
};

module.exports = {
  test
};
