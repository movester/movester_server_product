const loginEnum = Object.freeze({
    LOGIN_SUCCESS: 0,
    NOT_VERIFY: 1,
    INCORRECT_PASSWORD: 2,
    INCORRECT_EMAIL: 3
});

const joinEnum = Object.freeze({
    JOIN_SUCCESS: 0,
    DB_ERROR: 1,
    INCORRECT_PASSWORD: 2,
    EXIST_EMAIL: 3
});

const emailVerifyEnum = Object.freeze({
    EMAIL_VERIFY_SUCCESS: 0,
    DB_ERROR: 1,
    NOT_EXIST_EMAIL: 2,
    INCORRECT_KEY: 3,
    ALREADY_VERIFY : 4
})

module.exports = {
    joinEnum,
    loginEnum,
    emailVerifyEnum
}