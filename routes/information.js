var express = require('express');
var md5 = require("md5");
var User = require("../model/user.js");
var router = express.Router();

router.get('/', function(req, res) {
    var url = req.query.redirect;
    var response = req.flash('response')[0];
    var redirect = false;
    if (url) {
        redirect = true;
    }
    return res.render('information', {
        title: '迷晨',
        redirect: redirect,
        redirectUrl: url,
        msg: (response)? response.msg : 'Nothing to show.',
        login: !req.session.user
    });
});

module.exports = router;