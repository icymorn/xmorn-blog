/**
 * Created by v-jiangz on 8/12/2014.
 */
var error = {
    'en-us': {
        // for all
        0: 'Unknown error',
        1: 'Success',
        // user
        2: 'Username does not exists.',
        3: 'Password is incorrect.',
        4: 'Login success.',

        5: 'User regists failed',
        6: 'Username already exists.',
        7: 'Regists successfuly.',

        8: 'You need login.',
        9: 'Logout successfuly.'
    }
};

function Response(result, code, lang) {
    if (lang === undefined) {
        lang = 'en-us';
    }
    return {
        code: 1,
        msg: error[lang][1],
        result: result
    };
}

module.exports = Response;