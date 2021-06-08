const bcrypt = require("bcrypt");
const saltRounds = 10;

//비밀번호 암호화
const hashPassword = async password => {
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    });
    return hashedPassword;
};

//비밀번호 복호화
const comparePassword = async (password, hashPassword) => {
    const comparedPassword = await new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPassword, function (err, res) {
            if (err) {
                console.log("bcrypt.compare() error");
            } else {
                resolve(res);
            }
        });
    });
    return comparedPassword;
};

module.exports = {
    hashPassword,
    comparePassword
};