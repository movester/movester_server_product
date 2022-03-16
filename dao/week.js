const pool = require('./pool');

const getExposedWeek = async () => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT week_stretching_idx AS 'weekIdx'
                      , title
                      , (SELECT b.image
                           FROM stretching b
                          WHERE a.mon_stretching_idx = b.stretching_idx) AS 'mon'
                      , (SELECT b.image
                           FROM stretching b
                          WHERE a.tue_stretching_idx = b.stretching_idx) AS 'tue'
                      , (SELECT b.image
                           FROM stretching b
                          WHERE a.wed_stretching_idx = b.stretching_idx) AS 'wed'
                      , (SELECT b.image
                           FROM stretching b
                          WHERE a.thu_stretching_idx = b.stretching_idx) AS 'thu'
                      , (SELECT b.image
                           FROM stretching b
                          WHERE a.fri_stretching_idx = b.stretching_idx) AS 'fri'
                      , (SELECT b.image
                           FROM stretching b
                          WHERE a.sat_stretching_idx = b.stretching_idx) AS 'sat'
                      , (SELECT b.image
                           FROM stretching b
                          WHERE a.sun_stretching_idx = b.stretching_idx) AS 'sun'
                  FROM week_stretching a
                 WHERE is_expose = 1;`;

    const [row] = await connection.query(sql);
    return row.length ? row[0] : null;
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
