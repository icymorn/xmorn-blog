var express = require('express');
var md5 = require("md5");
var User = require("../model/user.js");
var Response = require("../model/response.js");
var error = require("../model/error.js");
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res) {

    return res.render('login', {
        title: 'Login',
        login: false
    });

});

router.post('/login', function(req, res) {
    var username = req.param('username', null);
    var password = md5.digest_s(req.param('password', null));

    User.getByUsername(username, function(err, user) {
        if (err) {
            console.error(err);
            req.flash('response', Response(user, error.UNKNOWN, 'en-us'));
            return res.redirect('/info/?redirect=' + encodeURI('/user/login'));
        } else {
            if (user === null || user === undefined) {
                req.flash('response', Response(user, error.USER_NAME_NOT_FOUND, 'en-us'));
                return res.redirect('/info/?redirect=' + encodeURI('/user/login'));
            } else if (password !== user.password) {
                req.flash('response', Response(user, error.USER_PASSWORD_INCORRECT, 'en-us'));
                return res.redirect('/info/?redirect=' + encodeURI('/user/login'));
            } else {
                req.session.user = user;
                req.flash('response', Response(user, error.USER_LOGIN_SUCCSS, 'en-us'));
                return res.redirect('/info/?redirect=' + encodeURI('/'));
            }
        }
    });
});

router.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('response', Response(null, error.USER_LOGOUT_SUCCESS, 'en-us'));
    return res.redirect('/info/?redirect=' + encodeURI('/'));
});

module.exports = router;
