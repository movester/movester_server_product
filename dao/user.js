const pool = require("../dao/pool.js");

const test = async () => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const sql = `SELECT user_idx, email, name FROM user`;
      const [rows] = await connection.query(sql);
      connection.release();
      return rows;
    } catch (err) {
      console.log("Query Error");
      connection.release();
      return false;
    }
  } catch (err) {
    console.log("DB Error");
    return false;
  }
};

module.exports = {
  test
};
