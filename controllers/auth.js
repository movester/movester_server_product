const axios = require('axios');
const qs = require('qs');
const userService = require('../service/user');
const CODE = require('../utils/statusCode');
const MSG = require('../utils/responseMessage');
const form = require('../utils/responseForm');

const getKakaoToken = async (req, res) => {
  try {
    const token = await axios({
      method: 'post',
      url: process.env.KAKAO_GET_TOKEN_URL,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirectUri: process.env.KAKAO_CALLBACK_URL,
        code: req.query.code,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
      }),
    });

    const user = await axios({
      method: 'get',
      url: process.env.KAKAO_GET_USER_URL,
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });

    const authUser = await userService.authKaKako(user.data)

    return res
    .status(CODE.OK)
    .cookie('accessToken', authUser.token.accessToken, { httpOnly: true })
    .cookie('refreshToken', authUser.token.refreshToken, { httpOnly: true })
    .json(form.success(authUser.user));

  } catch (err) {
    console.error(`=== Auth Ctrl getToken Error: ${err.data} === `);
    return res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  getKakaoToken,
};
