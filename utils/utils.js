const successTrue = (message, data) => {
    return {
        success: true,
        message: message,
        data: data
    };
};

const successFalse = message => {
    return {
        success: false,
        message: message
    };
};

module.exports = {
    successTrue,
    successFalse
};
