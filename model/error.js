/**
 * Created by v-jiangz on 8/12/2014.
 */

var errCode = {
    UNKNOWN: 0,
    SUCCESS: 1,

    USER_NAME_NOT_FOUND: 2,
    USER_PASSWORD_INCORRECT: 3,
    USER_LOGIN_SUCCSS: 4,

    USER_REGISTER_FAIL: 5,
    USER_NAME_ALREADY_EXIST: 6,
    USER_REGISTER_SUCCESS: 7,

    NEED_LOGIN: 8,
    USER_LOGOUT_SUCCESS: 9
};

module.exports = errCode;