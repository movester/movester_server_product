const smtpTransport = require('../config/nodemailer');

const emailAuthSender = async (email, emailVerifyKey) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: `${email}`,
    subject: '이메일 인증을 진행해주세요.',
    html: `<h1>MOVESTER 회원가입을 위한 이메일 인증 절차입니다.</h1><br>오른쪽 숫자 6자리를 입력해주세요 :  ${emailVerifyKey}`,
  };

  const emailSender = await new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(`emailSender Error > ${err}`);
        reject(err);
      }
      smtpTransport.close();
      resolve(info);
    });
  });

  return emailSender;
};

module.exports = {
  emailAuthSender,
};
