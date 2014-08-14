/**
 * Created by moe on 8/14/14.
 */
var express = require('express');
var Post = require('../model/post.js');
var router = express.Router();
var settings = require('../setting.js').setting;

/* GET home page. */
router.get('/page/:page', function(req, res) {
    var page = parseInt(req.params.page) - 1;
    Post.get(page * settings.postsPerPage, settings.postsPerPage, function(err, posts){

        return res.render('index', {
            title: '迷晨',
            result: posts,
            postsPerPage: settings.postsPerPage,
            currentPage: page + 1,
            login: !req.session.user
        });
    });
});

router.get('/:postId', function(req, res) {
    var postId = req.params.postId;
    Post.getById(postId, function(err, post){
        return res.render('article', {
            title: post.title,
            result: post,
            login: !req.session.user
        });
    });
});

module.exports = router;
