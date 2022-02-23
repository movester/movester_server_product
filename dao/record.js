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

module.exports = {
  createRecord,
  findRecordByDate,
};
