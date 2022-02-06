const jwt = require('../modules/jwt');
const redis = require('../modules/redis');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const checkToken = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
  }

  const accessToken = await jwt.verifyAccessToken(req.cookies.accessToken);
  const refreshToken = await jwt.verifyRefeshToken(req.cookies.refreshToken);

  if (accessToken === TOKEN_INVALID || refreshToken === TOKEN_INVALID) {
    return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
  }
  if (accessToken === TOKEN_EXPIRED) {
    if (refreshToken === TOKEN_EXPIRED) {
      // access 만료 refesh 만료
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.UNAUTHORIZED));
    }
    // access 만료 refesh 유효
    const redisToken = await redis.get(refreshToken.idx);

    if (req.cookies.refreshToken !== redisToken) {
      return res.status(CODE.UNAUTHORIZED).json(form.fail(MSG.TOKEN_INVALID));
    }

    const newAccessToken = await jwt.signAccessToken({ idx: refreshToken.idx, email: refreshToken.email });

    res.cookie('accessToken', newAccessToken);
    req.cookies.accessToken = newAccessToken;

    next();
  } else if (refreshToken === TOKEN_EXPIRED) {
    // access 유효 refesh 만료

    const newRefreshToken = await jwt.signRefreshToken({ idx: accessToken.idx, email: accessToken.email });

    redis.set(accessToken.idx, newRefreshToken);
    res.cookie('refreshToken', newRefreshToken);
    req.cookies.refreshToken = newRefreshToken;

    next();
  } else {
    // access 유효 refesh 유효
    req.cookies.idx = accessToken.idx;
    next();
  }
};

module.exports = {
  checkToken,
};
