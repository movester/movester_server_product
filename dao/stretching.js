const pool = require('./pool');

const addLikeSql = `, CASE WHEN (SELECT user_like_idx
                                   FROM movester_db.user_like AS d
                                  WHERE a.stretching_idx = d.stretching_idx
                                    AND d.user_idx = 1
                                 ) IS NULL THEN FALSE ELSE TRUE END
                      AS 'like'`;

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

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , image
                      , main_body AS 'mainBody'
                      , sub_body AS 'subBody'
                      , (SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                          FROM stretching_posture AS b
                          WHERE a.stretching_idx = b.stretching_idx
                       GROUP BY b.stretching_idx
                        ) AS 'posture'
                      , (SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
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
                      , (SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                          FROM stretching_posture AS b
                          WHERE a.stretching_idx = b.stretching_idx
                       GROUP BY b.stretching_idx
                        ) AS 'posture'
                      , (SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                           FROM stretching_effect AS c
                          WHERE a.stretching_idx = c.stretching_idx
                       GROUP BY c.stretching_idx
                        ) AS 'effect'
                      ${userIdx ? addLikeSql : ""}
                  FROM stretching a
                 WHERE IFNULL((SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
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
                      , (SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                          FROM stretching_posture AS b
                          WHERE a.stretching_idx = b.stretching_idx
                       GROUP BY b.stretching_idx
                        ) AS 'posture'
                      , (SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                           FROM stretching_effect AS c
                          WHERE a.stretching_idx = c.stretching_idx
                       GROUP BY c.stretching_idx
                        ) AS 'effect'
                      ${userIdx ? addLikeSql : ""}
                  FROM stretching a
                 WHERE IFNULL((SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
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

const getStretching = async (stretchingIdx, userIdx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                     , title
                     , contents
                     , main_body AS 'mainBody'
                     , sub_body AS 'subBody'
                     , tool
                     , youtube_url AS 'youtube'
                     , image
                     , (SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                          FROM stretching_posture AS b
                         WHERE a.stretching_idx = b.stretching_idx
                      GROUP BY b.stretching_idx
                       ) AS 'posture'
                    , (SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                         FROM stretching_effect AS c
                        WHERE a.stretching_idx = c.stretching_idx
                     GROUP BY c.stretching_idx
                      ) AS 'effect'
                    , (SELECT AVG(difficulty)
                         FROM stretching_difficulty d
                        WHERE a.stretching_idx = d.stretching_idx
                      ) AS 'difficulty'
                    ${userIdx ? addLikeSql : ''}
                  FROM stretching a
                 WHERE a.stretching_idx = ${stretchingIdx}`;

    const [row] = await connection.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Stretching Dao getStretching Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getTagStretchings = async ({ main, sub, tool, posture, effect }, userIdx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const whereParam = {
      main: main && `a.main_body REGEXP ${main}`,
      sub: sub && `OR a.sub_body REGEXP ${sub}`,
      tool: tool && `OR a.tool REGEXP ${tool}`,
      effect:
        effect &&
        `OR IFNULL((SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                                      FROM stretching_effect AS b
                                     WHERE a.stretching_idx = b.stretching_idx
                                  GROUP BY b.stretching_idx
                                  ), '') REGEXP ${effect}`,
      posture:
        posture &&
        `OR IFNULL((SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                                        FROM stretching_posture AS c
                                       WHERE a.stretching_idx = c.stretching_idx
                                    GROUP BY c.stretching_idx
                                   ) REGEXP ${posture}`,
    };

    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , main_body AS 'mainBody'
                      , sub_body AS 'subBody'
                      , image
                      , (SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                           FROM stretching_effect AS b
                          WHERE a.stretching_idx = b.stretching_idx
                       GROUP BY b.stretching_idx
                        ) AS 'effect'
                      , (SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                           FROM stretching_posture AS c
                          WHERE a.stretching_idx = c.stretching_idx
                       GROUP BY c.stretching_idx
                        ) AS 'posture'
                       ${userIdx ? addLikeSql : ''}
                   FROM stretching a
                  WHERE ${whereParam.main}
                        ${whereParam.sub}
                        ${whereParam.tool}
                        ${whereParam.effect}
                        ${whereParam.posture}
               ORDER BY a.stretching_idx DESC;`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Stretching Dao getTagStretchings Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getRecommendStretchings = async (stretchingIdx, userIdx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_idx AS 'stretchingIdx'
                      , title
                      , main_body AS 'mainBody'
                      , sub_body AS 'subBody'
                      , image
                      , (SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                          FROM stretching_effect AS b
                          WHERE a.stretching_idx = b.stretching_idx
                       GROUP BY b.stretching_idx
                        ) AS 'effect'
                      , (SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                           FROM stretching_posture AS c
                          WHERE a.stretching_idx = c.stretching_idx
                       GROUP BY c.stretching_idx
                        ) AS 'posture'
                      ${userIdx ? addLikeSql : ''}
                   FROM stretching a
                  WHERE IFNULL((SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                                  FROM stretching_effect AS b
                                 WHERE a.stretching_idx = b.stretching_idx
                              GROUP BY b.stretching_idx
                        ), '') REGEXP (SELECT GROUP_CONCAT(effect_type SEPARATOR '|')
                                         FROM stretching_effect AS b
                                        WHERE b.stretching_idx = ${stretchingIdx}
                                     GROUP BY b.stretching_idx)
               ORDER BY RAND() LIMIT 4;`;

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Stretching Dao getRecommendStretchings Error: ${err} === `);
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
  getStretching,
  getTagStretchings,
  getRecommendStretchings,
};
