const successTrue = (message, resData) => {
    return {
        success: true,
        message: message,
        resData: resData
    };
};

const successFalse = (message, resData) => {
    return {
        success: false,
        message: message,
        resData: resData
    };
};

module.exports = {
    successTrue,
    successFalse
};
