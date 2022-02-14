const pool = require('./pool');

const setEmailVerifyKey = async (userIdx, emailVerifyKey, type) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                 INTO email_verify (user_idx, auth_num, auth_type, create_at) VALUES (${userIdx}, ${emailVerifyKey}, ${type}, now());`;

    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const join = async ({ joinUser }) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                 INTO user (email, password, name, create_at) VALUES ('${joinUser.email}', '${joinUser.password}', '${joinUser.name}', now());`;

    const [row] = await connection.query(sql);
    return row?.insertId;
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

    const sql = `SELECT user_idx AS userIdx, email, password, name, is_email_verify AS isEmailVerify
                   FROM user
                  WHERE email = '${email}'`;

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

    const sql = `SELECT user_idx AS userIdx, email, password, name, is_email_verify AS isEmailVerify
                   FROM user
                  WHERE user_idx = ${idx}`;

    const [row] = await connection.query(sql);
    return row.length ? row[0] : undefined;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getEmailVerifyKey = async (userIdx, type) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT auth_num AS emailVerifyKey
                   FROM email_verify
                  WHERE user_idx = ${userIdx}
                    AND auth_type = ${type}
               ORDER BY create_at DESC
                  LIMIT 1;`;

    const [row] = await connection.query(sql);
    return row[0]?.emailVerifyKey;
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

    const sql = `UPDATE user
                    SET is_email_verify = 1
                  WHERE user_idx = '${idx}'`;
                  
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
  setEmailVerifyKey,
  join,
  findUserByEmail,
  findUserByIdx,
  getEmailVerifyKey,
  emailVerify,
};
