const pool = require("../dao/pool.js");

const join = async ({ joinUser }) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `INSERT INTO user (email, password, name, email_verify_key, create_at) VALUES ('${joinUser.email}', '${joinUser.password}', '${joinUser.name}', '${joinUser.emailVerifyKey}', now())`;
            const [rows] = await connection.query(sql);
            connection.release();
            return rows;
        } catch (err) {
            console.log(`Query Error > ${row}`);
            connection.release();
            return false;
        }
    } catch (err) {
        return false;
    }
};

const login = async email => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `SELECT user_idx, email, password, name, is_email_verify FROM user WHERE email = '${email}'`;
            const [row] = await connection.query(sql);
            connection.release();
            return row;
        } catch (err) {
            console.log(`Query Error > ${row}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.log(`DB Error > ${row}`);
        return false;
    }
};

const findUserByEmail = async email => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `SELECT user_idx, email, password, name, is_email_verify, email_verify_key FROM user WHERE email = '${email}'`;
            const [rows] = await connection.query(sql);
            connection.release();
            return rows;
        } catch (err) {
            console.log(`Query Error > ${row}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.log(`DB Error > ${row}`);
        return false;
    }
};

const emailVerify = async email => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const sql = `UPDATE user SET is_email_verify = 1 WHERE email = '${email}'`;
            const [rows] = await connection.query(sql);
            connection.release();
            return rows;
        } catch (err) {
            console.log(`Query Error > ${row}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.log(`DB Error > ${row}`);
        return false;
    }
};

module.exports = {
    join,
    login,
    findUserByEmail,
    emailVerify
};
