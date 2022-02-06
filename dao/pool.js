const mysql = require('mysql2/promise');
const conn = require('../config/operationEnv');

const pool = mysql.createPool(conn);

module.exports = pool;
