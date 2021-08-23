const responseMessage = {
    JOIN_SUCCESS: "회원가입 성공",
    JOIN_FAIL: "회원 가입 실패",

    LOGIN_SUCCESS: "로그인 성공",
    LOGIN_FAIL: "로그인 실패",
    LOGOUT_SUCCESS: "로그아웃 성공",

    EMAIL_VERIFY_NOT: "이메일 인증을 하지 않았습니다.",
    EMAIL_VERIFY_SUCCESS: "이메일 인증 성공",
    EMAIL_VERIFY_ALREADY: "이미 이메일 인증된 사용자입니다.",
    EMAIL_VERIFY_KEY_MISMATCH: "이메일 인증 번호가 일치하지 않습니다",

    EMAIL_ALREADY_EXIST: "존재하는 email 입니다.",
    EMAIL_NOT_EXIST: "존재하지 않는 유저 email 입니다.",

    PW_MISMATCH: "비밀번호가 일치하지 않습니다",

    TOKEN_EMPTY: "토큰이 없습니다",
    TOKEN_INVALID: "올바르지 않은 토큰입니다.",
    TOKEN_GENERATE_REFRESH_SUCCESS: "토큰 재발급 성공",

    VALUE_NULL: "필요한 값이 없습니다.",
    VALUE_INVALID: "파라미터 값이 잘못 되었습니다.",

    ENCRYPT_ERROR: "비밀번호 암호화/복호화 에러",
    EMIAL_SENDER_ERROR: "이메일 인증 메일 전송 오류",
    DB_ERROR: "데이터베이스 오류",
    INTERNAL_SERVER_ERROR: "서버 내부 오류",

    X_NULL_VALUE: x => `${x}가 존재하지 않습니다.`,
    X_CREATE_SUCCESS: x => `${x} 작성 성공`,
    X_CREATE_FAIL: x => `${x} 작성 실패`,
    X_READ_ALL_SUCCESS: x => `${x} 전체 조회 성공`,
    X_READ_ALL_FAIL: x => `${x} 전체 조회 실패`,
    X_READ_SUCCESS: x => `${x} 조회 성공`,
    X_READ_FAIL: x => `${x} 조회 실패`,
    X_UPDATE_SUCCESS: x => `${x} 수정 성공`,
    X_UPDATE_FAIL: x => `${x} 수정 실패`,
    X_DELETE_SUCCESS: x => `${x} 삭제 성공`,
    X_DELETE_FAIL: x => `${x} 삭제 실패`,
    NO_X: x => `존재하는 ${x} 입니다.`,
    ALREADY_X: x => `존재하는 ${x} 입니다.`
};

module.exports = responseMessage;