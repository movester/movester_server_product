const smtpTransport = require('../config/nodemailer');

const emailAuthSender = async (email, emailAuthNum, type) => {
  const setType = {
    1: '회원가입',
    2: '비밀번호 변경',
  };
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: `${email}`,
    subject: '[MOVESTER] 이메일 인증을 진행해주세요.',
    html: `<div style="margin: 50px; padding: 30px; background-color: #ffffff; color: #000000;">
      <span style="font-size: 18px; font-weight: 800; color: #2a1598; ">MOVESTER</span>
      <h1 style="font-size: 20px; margin: 20px 0;">뭅스터 계정 인증 메일</h1>
      <p style="text-align: left; line-height: 25px;">
        안녕하세요. <br>
        뭅스터입니다. <br><br>
        ${setType[type]}을 위한 이메일 인증 절차입니다.<br><br>
        아래의 숫자 6자리를 입력해주세요. <br><br>
      </p>
      <span style="font-size: 36px; font-weight: 700; border-bottom: 1px solid gray;"> ${emailAuthNum}</span>
      <br><br>
     </div>`,
  };

  const emailSender = await new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('emailSender Error: ', err);
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
