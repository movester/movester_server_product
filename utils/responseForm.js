const success = data => ({
  success: true,
  data,
});

const fail = (error, data) => ({
  success: false,
  error,
  data,
});

module.exports = {
  success,
  fail,
};
