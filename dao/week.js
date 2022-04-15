const pool = require('./pool');

const getExposedWeek = async () => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT a.week_day AS 'weekDay'
                      , b.stretching_idx AS 'stretchingIdx'
                      , b.image
                  FROM week_day_stretching a
                  JOIN stretching b
                    ON a.stretching_idx = b.stretching_idx
                  WHERE week_stretching_idx
                                            = (SELECT week_stretching_idx
                                                 FROM movester_db.week_stretching
                                                WHERE is_expose = 1)
                  ORDER BY week_day`;

    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.error(`=== Week Dao getExposedWeek Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  getExposedWeek,
};
