const redisClient = require('../config/redis');

const get = idx =>
  new Promise((resolve, reject) => {
    redisClient.get(idx, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

const set = (idx, token) => redisClient.set(idx, token);

const del = idx => redisClient.del(idx);

module.exports = {
  get,
  set,
  del,
};
