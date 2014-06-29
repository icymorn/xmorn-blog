'use strict';

var util = {};
util.needLogin = function (req, res, next) {
    if (!req.session.user) {
        req.flash('error', "Please login!");
        return res.redirect("/admin/login");
    }
    next();
}
util.needLogout = function (req, res, next) {
    if (req.session.user) {
        req.flash('error', "You've login!");
        return res.redirect("/");
    }
    next();
}

module.exports = util;