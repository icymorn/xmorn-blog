/**
 * Created by moe on 8/14/14.
 */
var express = require('express');
var Post = require('../model/post.js');
var router = express.Router();
var settings = require('../setting.js').setting;

/* GET home page. */
router.get('/page/:page', function(req, res) {
    var page = parseInt(req.params.page);
    Post.get(page * settings.postsPerPage, settings.postsPerPage, function(err, posts){
        return res.render('index', {
            title: '迷晨',
            result: posts,
            postsPerPage: settings.postsPerPage,
            currentPage: page
        });
    });
});

module.exports = router;
