const smtpTransport = require('../config/nodemailer');

const emailVerifySender = async (email, emailVerifyKey) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: `${email}`,
    subject: '이메일 인증을 진행해주세요.',
    html: `<h1>MOVESTER 회원가입을 위한 이메일 인증 절차입니다.</h1><br>오른쪽 숫자 6자리를 입력해주세요 :  ${emailVerifyKey}`,
  };

  const emailSender = await new Promise(resolve => {
    const isEmailSenderSuccess = smtpTransport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(`emailSender Error > ${err}`);
        resolve(false);
      }
      smtpTransport.close();
      console.log(info.response);
      // resolve(true);
      resolve(isEmailSenderSuccess);
    });
    // return isEmailSenderSuccess;
  });

  return emailSender;
};

module.exports = {
  emailVerifySender,
};
