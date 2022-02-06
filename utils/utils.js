const successTrue = (message, data) => ({
  success: true,
  message,
  data,
});

const successFalse = (message, data) => ({
  success: false,
  message,
  data,
});

module.exports = {
  successTrue,
  successFalse,
};
