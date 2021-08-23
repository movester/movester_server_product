module.exports = async (passport) => {
    const KakaoStrategy = require('passport-kakao').Strategy;
    const kakao = require("../config/kakao")

    passport.use(
        "kakao-login",
        new KakaoStrategy(kakao.kakaoKey, (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            console.log(accessToken);
            const a = 1
            done(null,a);
        })
    );
  
    // passport.use(
    //   new KakaoStrategy('kakao',auth.kakaoKey, async (accessToken, refreshToken, profile, done) => {
    //    console.log(accessToken)
    //    console.log(profile)
        // const email = profile._json.kakao_account.email;
        // let user = await userService.deserializeUser(email);
        // if (user) {
        //   KakaoId = profile.id;
        //   const overlap = await userService.overlapBlocking(email, anotherSocailId, mySocailId);
        //   if (overlap) {
        //     const socialIdData = `user_kakaoId = '${KakaoId}'`;
        //     userEmail = await userService.addSocialId(email, socialIdData);
        //     user = {
        //       user_email: userEmail,
        //     };
        //   } else {
        //     console.log('다른 소셜 계정으로 회원가입 되어 있습니다.');
        //     return false;
        //   }
        // } else {
        //   user = {
        //     user_email: email,
        //     user_displayName: profile.displayName,
        //     user_kakaoId: profile.id,
        //   };
        //   const userData = `user_email = '${email}', user_name = '${profile.displayName}',  user_kakaoId = '${profile.id}', user_regdate = now()`;
        //   await userService.socialJoin(userData);
        // }
    //     done(null, user);
    //   }),
    // );
    return passport
  };