const mysql = require('mysql2/promise');
const conn = require('../config/operationEnv');

const pool = mysql.createPool(conn);

pool.on('acquire', connection => {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', connection => {
  console.log('Connection %d released', connection.threadId);
});

pool.on('enqueue', () => {
  console.log('Waiting for available connection slot');
});

module.exports = pool;
