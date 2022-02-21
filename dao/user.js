const pool = require('./pool');

const join = async ({ joinUser }) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                 INTO user (email, password, name) VALUES ('${joinUser.email}', '${joinUser.password}', '${joinUser.name}');`;

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

    const sql = `SELECT user_idx AS userIdx, email, password, name, is_email_auth AS isEmailAuth
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

    const sql = `SELECT user_idx AS userIdx, email, password, name, is_email_auth AS isEmailAuth
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

const setEmailAuthNum = async (userIdx, emailAuthNum, type) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                 INTO user_auth (user_idx, auth_num, auth_type) VALUES (${userIdx}, ${emailAuthNum}, ${type});`;

    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getEmailAuthNum = async (userIdx, type) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT auth_num AS emailAuthNum
                   FROM user_auth
                  WHERE user_idx = ${userIdx}
                    AND auth_type = ${type}
               ORDER BY create_at DESC
                  LIMIT 1;`;

    const [row] = await connection.query(sql);
    return row[0]?.emailAuthNum;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const setIsEmailAuth = async idx => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `UPDATE user
                    SET is_email_auth = 1
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

const deleteUser = async (idx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `DELETE
                   FROM user
                  WHERE user_idx = ${idx}`;

    const [row] = await connection.query(sql);

    return row;
  } catch (err) {
    console.log(`===DB Error > ${err}===`);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  join,
  findUserByEmail,
  findUserByIdx,
  setEmailAuthNum,
  getEmailAuthNum,
  setIsEmailAuth,
  deleteUser
};
