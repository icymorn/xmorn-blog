var express = require('express');
var Post = require('../model/post.js');
var router = express.Router();
var settings = require('../setting.js').setting;

/* GET home page. */
router.get('/', function(req, res) {
  Post.get(0, settings.postsPerPage, function(err, posts){
    return res.render('index', {
        title: '迷晨',
        result: posts,
        postsPerPage: settings.postsPerPage,
        currentPage: 0,
        login: !!req.session.user

    });
  });
});

module.exports = router;
