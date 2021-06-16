const bcrypt = require("bcrypt");
const saltRounds = 10;
const statusCode = require("../utils/statusCode");
const responseMessage = require("../utils/responseMessage");
const utils = require("../utils/utils");

const hashPassword = async password => {
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.log(`encrypt Error > ${err}`);
                resolve(false);
            }
            resolve(hash);
        });
    });
    return hashedPassword;
};

const comparePassword = async (password, hashPassword, res) => {
    const comparedPassword = await new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPassword, (err, res) => {
            if (err) {
                console.log(`encrypt Error > ${err}`);
                res.status(statusCode.INTERNAL_SERVER_ERROR).json(
                    utils.successFalse(responseMessage.ENCRYPT_ERROR)
                );
            }
            resolve(res);
        });
    });
    return comparedPassword;
};

module.exports = {
    hashPassword,
    comparePassword
};
