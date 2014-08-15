/**
 * Created by moe on 8/14/14.
 */
var express = require('express');
var Post = require('../model/post.js');
var router = express.Router();
var settings = require('../setting.js').setting;
var util = require('./util.js');
var Response = require("../model/response.js");
var error = require("../model/error.js");
var markdown = require( "markdown" ).markdown;


router.get('/page/:page', function(req, res) {
    var page = parseInt(req.params.page) - 1;
    Post.get(page * settings.postsPerPage, settings.postsPerPage, function(err, posts){

        return res.render('index', {
            title: '迷晨',
            result: posts,
            postsPerPage: settings.postsPerPage,
            currentPage: page + 1,
            login: !!req.session.user
        });
    });
});

router.get('/add', util.requireLogin);

router.get('/add', function(req, res) {
    return res.render('write', {
        title: 'write a post',
        login: !!req.session.user
    });
});

router.post('/add', util.requireLogin);

router.post('/add', function(req, res) {
    var title = req.param('title', 'Untitled');
    var content = req.param('content', '');
    var catalog = req.param('catalog', 'Default');
    var tags = req.param('tags', '');
    var private = parseInt(req.param('private', 0));
    var allowComment = parseInt(req.param('allowComment', 1));
    var post = new Post(title, content, req.session.user._id, Date.now(), catalog, 0, '', (private === 1)? true: false, (allowComment === 1)? true: false);
    post.save(function (err, post) {
        if (err) {
            req.flash('response', Response(post, error.POST_FAIL, 'en-us'));
            return res.redirect('/info/?redirect=' + encodeURI('/post/add'));
        }
        req.flash('response', Response(post, error.POST_SUCCESS, 'en-us'));
        return res.redirect('/info/?redirect=' + encodeURI('/post/' + post._id));
    });

});

router.get('/edit/:postId', util.requireLogin);

router.get('/edit/:postId', function(req, res) {
    var postId = req.params.postId;
    Post.getById(postId, function(err, post){
        if (err) {
            req.flash('response', Response(post, error.POST_NOT_EXIST, 'en-us'));
            return res.redirect('/info/?redirect=' + encodeURI('/'));
        }

        post.content = post.content.replace(new RegExp('\r\n','g'), '<br />').replace(new RegExp('\n','g'), '<br />');
        return res.render('update', {
            title: post.title,
            result: post,
            login: !!req.session.user
        });
    });
});

router.get('/del/:postId', util.requireLogin);

router.get('/del/:postId', function(req, res) {
    var postId = req.params.postId;
    Post.delete(postId, function(err){
        if (err) {
            req.flash('response', Response(null, error.POST_DELETE_FAIL, 'en-us'));
            return res.redirect('/info/?redirect=' + encodeURI('/post/' + postId));
        }

        req.flash('response', Response(null, error.POST_DELETE_SUCCESS, 'en-us'));
        return res.redirect('/info/?redirect=' + encodeURI('/'));
    });
});

router.post('/edit/:postId', util.requireLogin);

router.post('/edit/:postId', function(req, res) {
    var postId = req.params.postId;
    var title = req.param('title', 'untitled');
    var content = req.param('content', '');
    var tags = req.param('tags', '');
    var catalog = req.param('catalog', '');
    var post = new Post(title, content, null, null, catalog, null, tags, postId);
    post.update(function(err, post){
        if (err) {
            req.flash('response', Response(post, error.POST_NOT_EXIST, 'en-us'));
            return res.redirect('/info/?redirect=' + encodeURI('/'));
        }
        return res.redirect('/post/' + postId);
    });
});


router.get('/:postId', function(req, res) {
    var postId = req.params.postId;
    Post.getById(postId, function(err, post){
        if (err) {
            req.flash('response', Response(post, error.POST_NOT_EXIST, 'en-us'));
            return res.redirect('/info/?redirect=' + encodeURI('/'));
        }
        Post.addPV(post._id.toString());
        post.content = markdown.toHTML(post.content);
        return res.render('article', {
            title: post.title,
            result: post,
            login: !!req.session.user
        });
    });
});

module.exports = router;
