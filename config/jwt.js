require('dotenv').config();

const jwtConfig = {
  secretKey: process.env.JWT_ACCESS_SECRET,
  refeshSecretKey: process.env.JWT_REFRESH_SECRET,
  option: {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_ACCESS_TIME,
    issuer: 'movester',
  },
  refeshOption: {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_REFRESH_TIME,
    issuer: 'movester',
  },
};

module.exports = jwtConfig;
