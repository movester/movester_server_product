const pool = require('./pool');

const createRecord = async (userIdx, type, record, year, month) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                 INTO user_record (user_idx, record_type, record, record_year, record_month) VALUES (${userIdx}, ${type}, ${record}, ${year}, ${month});`;

    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.error(`=== Record Dao createRecord Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findRecentRecord = async (userIdx, type) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT DATE_FORMAT(create_at,'%Y %m %d') AS date
                   FROM user_record
                  WHERE user_idx = ${userIdx}
                    AND record_type = ${type}
               ORDER BY create_at DESC
                  LIMIT 1;`;

    const [row] = await connection.query(sql);
    return row[0]?.date;
  } catch (err) {
    console.error(`=== Record Dao findRecentRecord Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const isExistCurRecord = async (userIdx, type) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT record
                   FROM user_record
                  WHERE user_idx = ${userIdx}
                    AND record_type = ${type}
                    AND record_year = YEAR(CURDATE())
                    AND record_month = MONTH(CURDATE())
                    AND DATE_FORMAT(create_at,'%d') = DAY(CURDATE())`;

    const [row] = await connection.query(sql);
    return row[0]?.record
  } catch (err) {
    console.error(`=== Record Dao isExistCurRecord Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const updateRecord = async (userIdx, type, record) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `UPDATE user_record
                    SET record = ${record}
                  WHERE user_idx = ${userIdx}
                    AND record_type = ${type}
                    AND record_year = YEAR(CURDATE())
                    AND record_month = MONTH(CURDATE())`;

    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.error(`=== Record Dao updateRecord Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  createRecord,
  findRecentRecord,
  isExistCurRecord,
  updateRecord
};
