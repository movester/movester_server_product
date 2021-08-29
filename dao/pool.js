const mysql = require("mysql2/promise");
const conn = require("../config/operationEnv.js");

const pool = mysql.createPool(conn);

pool.on("acquire", function (connection) {
    console.log("Connection %d acquired", connection.threadId);
});

pool.on("release", function (connection) {
    console.log("Connection %d released", connection.threadId);
});

pool.on("enqueue", function () {
    console.log("Waiting for available connection slot");
});

module.exports = pool;
