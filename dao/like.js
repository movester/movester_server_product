const pool = require('./pool');

const findLikeByUserIdxAndStretchingIdx = async (userIdx, stretchingIdx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT user_like_idx AS 'likeIdx'
                   FROM user_like
                  WHERE stretching_idx = ${stretchingIdx}
                    AND user_idx = ${userIdx};`;

    const [row] = await connection.query(sql);
    return row.length ? row : null;
  } catch (err) {
    console.error(`=== Like Dao findLikeByUserIdxAndStretchingIdx Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const createLike = async (userIdx, stretchingIdx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                   INTO user_Like (stretching_idx, user_idx)
                 VALUES (${stretchingIdx}, ${userIdx});`;

    const [row] = await connection.query(sql);
    return row?.insertId;
  } catch (err) {
    console.error(`=== Like Dao createLike Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const deleteLike = async likeIdx => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `DELETE
                   FROM user_like
                  WHERE user_like_idx = ${likeIdx};`;

    const [row] = await connection.query(sql);

    return row?.affectedRows
  } catch (err) {
    console.error(`=== Like Dao deleteLike Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const getLikes = async userIdx => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT a.user_like_idx AS 'likeIdx', a.stretching_idx AS 'stretchingIdx', DATE_FORMAT(a.create_at,'%Y-%m-%d') AS date, b.title, b.main_body AS 'mainBody', b.sub_body AS 'subBody', b.image
                   FROM movester_db.user_like AS a
                   JOIN movester_db.stretching AS b
                     ON a.stretching_idx = b.stretching_idx
                  WHERE a.user_idx = ${userIdx}
               ORDER BY a.user_like_idx DESC;`;

    const [row] = await connection.query(sql);

    return row
  } catch (err) {
    console.error(`=== Like Dao getLikes Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};


module.exports = {
  findLikeByUserIdxAndStretchingIdx,
  createLike,
  deleteLike,
  getLikes
};
