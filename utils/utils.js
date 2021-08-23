const successTrue = (message, data) => {
    return {
        success: true,
        message: message,
        data: data
    };
};

const successFalse = (message, data) => {
    return {
        success: false,
        message: message,
        data: data
    };
};

module.exports = {
    successTrue,
    successFalse
};
