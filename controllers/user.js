const userService = require("../service/user");

const test = async (req, res) => {
  const row = await userService.test();
  res.send(row);
};

module.exports = {
  test
};
