
module.exports.requireLogin = function (req, res, next) {
    if (!req.session.user) {
        res.send(Response(null, ErrCode.NEED_LOGIN, 'en-us'));
    } else {
        next();
    }
}