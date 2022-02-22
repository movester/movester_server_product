const pool = require('./pool');

const createRecord = async (userIdx, type, record, year, month) => {
  let connection;
  console.log(userIdx, type, record, year, month)
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

module.exports = {
  createRecord,
};
