const bcrypt = require('bcrypt');

const saltRounds = 10;

const hash = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });

const compare = async (password, hashPassword) => await bcrypt.compare(password, hashPassword);
module.exports = {
  hash,
  compare,
};
