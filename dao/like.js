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

module.exports = {
  findLikeByUserIdxAndStretchingIdx,
  createLike,
};
