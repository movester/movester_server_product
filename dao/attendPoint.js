const pool = require('./pool');

const createAttendPoint = async (userIdx, year, month) => {
  let connection;
  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                   INTO attend_point (user_idx, attend_year, attend_month)
                 VALUES (${userIdx}, ${year}, ${month});`;

    const [row] = await connection.query(sql);
    return !!Object.keys(row);
  } catch (err) {
    console.error(`=== AttendPoint Dao createAttendPoint Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const findAttendPointByDate = async (userIdx, year, month, date) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_idx, create_at
                   FROM attend_point
                  WHERE user_idx = ${userIdx}
                    AND DATE(create_at) = '${year}-${month}-${date}';`;

    const [row] = await connection.query(sql);
    return !!row.length;
  } catch (err) {
    console.error(`=== AttendPoint Dao findAttendPointByDate Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  createAttendPoint,
  findAttendPointByDate,
};
