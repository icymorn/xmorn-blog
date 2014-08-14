/**
 * Created by moe on 8/12/14.
 */
var express = require('express');
var router = express.Router();
var md5 = require("md5");
var User = require("../model/user.js");
var Post = require("../model/post.js");
var Response = require("../model/response.js");
var ErrCode = require("../model/error.js");

function requireLogin(req, res, next) {
    if (!req.session.user) {
        res.send(Response(null, ErrCode.NEED_LOGIN, 'en-us'));
    } else {
        next();
    }
}
/**
 * login method
 */

router.post('/user/login', function(req, res) {
    var username = req.param('username', null);
    var password = md5.digest_s(req.param('password', null));
    // Todo: filter the input
    User.getByUsername(username, function(err, user) {
        if (err) {
            console.error(err);
            return res.send(Response(user, ErrCode.UNKNOWN, 'en-us'));
        } else {
            if (user === null || user === undefined) {
                return res.send(Response(user, ErrCode.USER_NAME_NOT_FOUND, 'en-us'));
            } else if (password !== user.password) {
                return res.send(Response(user, ErrCode.USER_PASSWORD_INCORRECT, 'en-us'));
            } else {
                req.session.user = user;
                return res.send(Response(user, ErrCode.USER_LOGIN_SUCCSS, 'en-us'));
            }
        }
    });
});

/**
 * register method
 */
router.post('/user/reg', function(req, res) {
    var username = req.param('username', null);
    var password = req.param('password', null);
    // Todo: filter the input

    var user = new User(username, md5.digest_s(password));
    user.save(function(err, user){
        if (err) {
            console.error(err);
            return res.send(Response(user, ErrCode.UNKNOWN, 'en-us'));
        } else {
            if (user === undefined || user === null) {
                return res.send(Response(user, ErrCode.USER_REGISTER_FAIL, 'en-us'));
            } else {
                return res.send(Response(user, ErrCode.USER_REGISTER_SUCCESS));
            }
        }
    });
});

/**
 * logout method
 */
router.get('/user/logout', function(req, res) {
    res.session.user = undefined;
    return res.send(Response(null, ErrCode.USER_LOGOUT_SUCCESS));
});

/**
 * add post
 */
router.post('/post/add', requireLogin);
router.post('/post/add', function(req, res) {
    var post = new Post('title', 'content', req.session.user.ObjectId, Date.now(), 'catalog', 5, 'tags');
    post.save(function(err, post) {
       return res.send(post);
    });
});

/**
 * delete post
 */
router.get('/post/del/:postId', requireLogin);
router.get('/post/del/:postId', function(req, res) {
    //todo delete post
    var post = new Post('title', 'content', req.session.user.ObjectId, Date.now(), 'catalog', 5, 'tags');
    post.save(function(err, post) {
        return res.send(post);
    });
});

/**
 * get one post
 */
router.get('/post/:postId', requireLogin);
router.get('/post/:postId', function(req, res) {
    //todo check post
    var postId = req.params.postId;
    Post.getById(postId, function(err, post) {
        return res.send(post);
    });
});

/**
 * delete post
 */
router.get('/post/offset/:offset/:count', function(req, res) {
    var offset = parseInt(req.params.offset);
    var count = parseInt(req.params.count);
    // todo: exam input value
    Post.get(offset, count, function(err, posts) {
        res.send(posts);
    });

});

module.exports = router;