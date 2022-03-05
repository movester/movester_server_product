const pool = require('./pool');

const findDifficultyByUserIdxAndStretchingIdx = async (userIdx, stretchingIdx) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `SELECT stretching_difficulty_idx AS 'difficultyIdx'
                   FROM stretching_difficulty
                  WHERE user_idx = ${userIdx}
                    AND stretching_idx = ${stretchingIdx};`;

    const [row] = await connection.query(sql);
    return row.length ? row[0] : null;
  } catch (err) {
    console.error(`=== Difficulty Dao findDifficultyByUserIdxAndStretchingIdx Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

const createDifficulty = async (userIdx, stretchingIdx, difficulty) => {
  let connection;

  try {
    connection = await pool.getConnection(async conn => conn);

    const sql = `INSERT
                   INTO stretching_difficulty (user_idx, stretching_idx, difficulty)
                 VALUES (${userIdx}, ${stretchingIdx}, ${difficulty});`;

    const [row] = await connection.query(sql);
    return row?.insertId;
  } catch (err) {
    console.error(`=== Difficulty Dao createDifficulty Error: ${err} === `);
    throw new Error(err);
  } finally {
    connection.release();
  }
};

module.exports = {
  findDifficultyByUserIdxAndStretchingIdx,
  createDifficulty,
};
