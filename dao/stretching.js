const pool = require('./pool');

const addLikeSql = userIdx =>
  `, CASE WHEN (SELECT user_like_idx
                                     FROM movester_db.user_like AS d
                                    WHERE a.stretching_idx = d.stretching_idx
                                      AND d.user_idx = ${userIdx}
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

const getStretchingsByBodypart = async (main, sub, userIdx, page) => {
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
                      ${userIdx ? addLikeSql(userIdx) : ""}
                  FROM stretching a
                 WHERE main_body LIKE CONCAT('%', ${main},'%')
                   AND IFNULL(sub_body, '') LIKE CONCAT('%', ${sub},'%')
              ORDER BY a.create_at DESC
                 LIMIT ${page}, 12;`

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Stretching Dao getStretchingsByBodypart Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getStretchingsByPosture = async (main, userIdx, page) => {
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
                      ${userIdx ? addLikeSql(userIdx) : ""}
                  FROM stretching a
                 WHERE IFNULL((SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                                 FROM stretching_posture AS b
                                WHERE a.stretching_idx = b.stretching_idx
                             GROUP BY b.stretching_idx
                       ), '') LIKE CONCAT('%', ${main} ,'%')
              ORDER BY a.create_at DESC
                 LIMIT ${page}, 12;`

    const [row] = await connection.query(sql);
    return row;
  } catch (err) {
    console.error(`=== Stretching Dao getStretchingsByPosture Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getStretchingsByEffect = async (main, userIdx, page) => {
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
                      ${userIdx ? addLikeSql(userIdx) : ""}
                  FROM stretching a
                 WHERE IFNULL((SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                                 FROM stretching_effect AS c
                                WHERE a.stretching_idx = c.stretching_idx
                             GROUP BY c.stretching_idx
                       ), '') LIKE CONCAT('%', ${main} ,'%')
              ORDER BY a.create_at DESC
                 LIMIT ${page}, 12;`

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
                    ${userIdx ? addLikeSql(userIdx) : ''}
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

const getTagStretchings = async (tag, userIdx) => {
  let connection;
  const firstSearch = Object.values(tag).findIndex(v => v);
  try {
    connection = await pool.getConnection(async conn => conn);

    const whereParam = {
      main: tag.main && `a.main_body REGEXP ${tag.main}`,
      sub: tag.sub && `${firstSearch < 1 ? 'OR' : ''} a.sub_body REGEXP ${tag.sub}`,
      tool: tag.tool && `${firstSearch < 2 ? 'OR' : ''} a.tool REGEXP ${tag.tool}`,
      effect:
        tag.effect &&
        `${firstSearch < 3 ? 'OR' : ''} IFNULL((SELECT GROUP_CONCAT(effect_type SEPARATOR ' ')
                                      FROM stretching_effect AS b
                                     WHERE a.stretching_idx = b.stretching_idx
                                  GROUP BY b.stretching_idx
                                  ), '') REGEXP ${tag.effect}`,
      posture:
        tag.posture &&
        `${firstSearch < 4 ? 'OR' : ''} IFNULL((SELECT GROUP_CONCAT(posture_type SEPARATOR ' ')
                                        FROM stretching_posture AS c
                                       WHERE a.stretching_idx = c.stretching_idx
                                    GROUP BY c.stretching_idx
                                  ), '') REGEXP ${tag.posture}`,
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
                       ${userIdx ? addLikeSql(userIdx) : ''}
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
                      ${userIdx ? addLikeSql(userIdx) : ''}
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
