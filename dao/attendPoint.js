const pool = require('./pool');

const createAttendPoint = async (userIdx, year, month) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                 INTO attend_point (user_idx, attend_year, attend_month) VALUES (${userIdx}, ${year}, ${month});`;

    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.error(`=== AttendPoint Dao createAttendPoint Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findRecentAttendPoint = async userIdx => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT DATE_FORMAT(create_at,'%Y %m %d') AS date
                   FROM attend_point
                  WHERE user_idx = ${userIdx}
               ORDER BY create_at DESC
                  LIMIT 1;`;

    const [row] = await connection.query(sql);
    return row[0]?.date;
  } catch (err) {
    console.error(`=== AttendPoint Dao createAttendPoint Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getAttendPointsByYearMonth = async (userIdx, year, month) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT DATE_FORMAT(create_at,'%e') AS day
                   FROM movester_db.attend_point
                  WHERE user_idx = ${userIdx}
                    AND attend_year = ${year}
                    AND attend_month = ${month}
               ORDER BY attend_point_idx;`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== AttendPoint Dao getAttendPointsByYearMonth Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  createAttendPoint,
  findRecentAttendPoint,
  getAttendPointsByYearMonth,
};
