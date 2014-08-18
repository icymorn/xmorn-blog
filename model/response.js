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
        9: 'Logout successfuly.',

        10: 'The post is pubished successfully.',
        11: 'Post failed due to unknown reason.',
        12: 'Post does not exist.',
        13: 'This post is locked for comments,',
        14: 'Delete fail.',
        15: 'Delete successfully.',
        16: 'Updated.',
        17: 'Updated Failed',

        18: 'Comment added.',
        19: 'Failed to comment',
        20: 'Deleted comment',
        21: 'Failed to detele comment'
    }
};

function Response(result, code, lang) {
    if (lang === undefined) {
        lang = 'en-us';
    }
    return {
        code: code,
        msg: error[lang][code],
        result: result
    };
}

module.exports = Response;