const pool = require('./pool');

const join = async ({ joinUser }) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `INSERT INTO user (email, password, name, email_verify_key, create_at) VALUES ('${joinUser.email}', '${joinUser.password}', '${joinUser.name}', '${joinUser.emailVerifyKey}', now())`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : undefined;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const login = async email => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `SELECT user_idx, email, password, name, is_email_verify FROM user WHERE email = '${email}'`;
    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findUserByEmail = async email => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `SELECT user_idx, email, password, name, is_email_verify FROM user WHERE email = '${email}'`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : undefined;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findUserByIdx = async idx => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);
    const sql = `SELECT user_idx, email, password, name, is_email_verify, email_verify_key FROM user WHERE user_idx = ${idx}`;
    const [row] = await connection.query(sql);
    return row.length ? row[0] : undefined;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const emailVerify = async idx => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `UPDATE user SET is_email_verify = 1 WHERE user_idx = '${idx}'`;
    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  join,
  login,
  findUserByEmail,
  findUserByIdx,
  emailVerify,
};
