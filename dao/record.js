const pool = require('./pool');

const createRecord = async (userIdx, type, record, year, month) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                   INTO user_record (user_idx, record_type, record, record_year, record_month)
                 VALUES (${userIdx}, ${type}, ${record}, ${year}, ${month});`;

    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.error(`=== Record Dao createRecord Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findRecordByDate = async (userIdx, type, year, month, date) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx, record_type, record, create_at
                   FROM user_record
                  WHERE user_idx = ${userIdx}
                    AND record_type = ${type}
                    AND DATE(create_at) = '${year}-${month}-${date}'`;

    const [row] = await connection.query(sql);
    return !!row.length;
  } catch (err) {
    console.error(`=== Record Dao findTodayRecord Error: ${err} === `);
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
                    AND record_month = MONTH(CURDATE())
                    AND DATE_FORMAT(create_at,'%d') = DAY(CURDATE())`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Record Dao updateRecord Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const deleteRecord = async (userIdx, type) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `DELETE
                   FROM user_record
                  WHERE user_idx = ${userIdx}
                    AND record_type = ${type}
                    AND record_year = YEAR(CURDATE())
                    AND record_month = MONTH(CURDATE())
                    AND DATE_FORMAT(create_at,'%d') = DAY(CURDATE())`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Record Dao deleteRecord Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getSummaryRecords = async userIdx => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `(SELECT record_type AS type, record, DATE_FORMAT(create_at,'%Y-%m-%d') AS date
                    FROM user_record
                   WHERE user_idx = ${userIdx}
                     AND record_type = 1
                ORDER BY create_at DESC
                   LIMIT 0,10)
                   UNION
                 (SELECT record_type AS type, record, DATE_FORMAT(create_at,'%Y-%m-%d') AS date
                    FROM user_record
                   WHERE user_idx = ${userIdx}
                     AND record_type = 2
                ORDER BY create_at DESC
                   LIMIT 0,10)`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Record Dao getSummaryRecords Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  createRecord,
  updateRecord,
  findRecordByDate,
  deleteRecord,
  getSummaryRecords,
};
