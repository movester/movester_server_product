const pool = require('./pool');

const addLikeSql = `, CASE WHEN (SELECT user_like_idx
                                   FROM movester_db.user_like AS d
                                  WHERE a.stretching_idx = d.stretching_idx
                                    AND d.user_idx = 1
                                 ) IS NULL THEN FALSE ELSE TRUE END
                      AS 'like'`

const findStretchingByIdx = async idx => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_idx AS 'stretchingIdx', title
                   FROM stretching
                  WHERE stretching_idx = ${idx}`;

    const [row] = await connection.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Stretching Dao findStretchingByIdx Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getStretchingsByBodypart = async (main, sub, userIdx) => {
  let connection;
  if(userIdx) console.log("있다!")

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , image
                      , main_body AS 'mainBody'
                      , sub_body AS 'subBody'
                      , (SELECT group_concat(posture_type SEPARATOR ' ')
                          FROM stretching_posture AS b
                          WHERE a.stretching_idx = b.stretching_idx
                       GROUP BY b.stretching_idx
                        ) AS 'posture'
                      , (SELECT group_concat(effect_type SEPARATOR ' ')
                           FROM stretching_effect AS c
                          WHERE a.stretching_idx = c.stretching_idx
                       GROUP BY c.stretching_idx
                        ) AS 'effect'
                      ${userIdx ? addLikeSql : ""}
                  FROM stretching a
                 WHERE main_body LIKE CONCAT('%', ${main},'%')
                   AND IFNULL(sub_body, '') LIKE CONCAT('%', ${sub},'%')
              ORDER BY a.create_at DESC`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Stretching Dao getStretchingsByBodypart Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getStretchingsByPosture = async (main, userIdx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , image
                      , main_body AS 'mainBody'
                      , sub_body AS 'subBody'
                      , (SELECT group_concat(posture_type SEPARATOR ' ')
                          FROM stretching_posture AS b
                          WHERE a.stretching_idx = b.stretching_idx
                       GROUP BY b.stretching_idx
                        ) AS 'posture'
                      , (SELECT group_concat(effect_type SEPARATOR ' ')
                           FROM stretching_effect AS c
                          WHERE a.stretching_idx = c.stretching_idx
                       GROUP BY c.stretching_idx
                        ) AS 'effect'
                      ${userIdx ? addLikeSql : ""}
                  FROM stretching a
                 WHERE IFNULL((SELECT group_concat(posture_type SEPARATOR ' ')
                                 FROM stretching_posture AS b
                                WHERE a.stretching_idx = b.stretching_idx
                             GROUP BY b.stretching_idx
                       ), '') LIKE CONCAT('%', ${main} ,'%')
              ORDER BY a.create_at DESC`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Stretching Dao getStretchingsByPosture Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getStretchingsByEffect = async (main, userIdx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , image
                      , main_body AS 'mainBody'
                      , sub_body AS 'subBody'
                      , (SELECT group_concat(posture_type SEPARATOR ' ')
                          FROM stretching_posture AS b
                          WHERE a.stretching_idx = b.stretching_idx
                       GROUP BY b.stretching_idx
                        ) AS 'posture'
                      , (SELECT group_concat(effect_type SEPARATOR ' ')
                           FROM stretching_effect AS c
                          WHERE a.stretching_idx = c.stretching_idx
                       GROUP BY c.stretching_idx
                        ) AS 'effect'
                      ${userIdx ? addLikeSql : ""}
                  FROM stretching a
                 WHERE IFNULL((SELECT group_concat(effect_type SEPARATOR ' ')
                                 FROM stretching_effect AS c
                                WHERE a.stretching_idx = c.stretching_idx
                             GROUP BY c.stretching_idx
                       ), '') LIKE CONCAT('%', ${main} ,'%')
              ORDER BY a.create_at DESC`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Stretching Dao getStretchingsByEffect Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  findStretchingByIdx,
  getStretchingsByBodypart,
  getStretchingsByPosture,
  getStretchingsByEffect,
};
