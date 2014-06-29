/* GET home page. */
var crypto = require('crypto'),
	User = require('../models/user.js'),
    Post = require('../models/post.js'),
	Util = require('../routes/util.js'),
    Async = require('async'),
    fs = require("fs");

module.exports = function (app) {

    app.get('/', function (req, res) {
        var posts;
        Post.get(null, function (err, posts) {
            if (err) {
                posts = [];
                req.flash("error", err);
            }

            var len = posts.length;
            var userlist = function (i) {
                if (i < 0) {
                    res.render('index', {
                        page: 'HomePage',
                        posts: posts,
                        user: req.session.user,
                        error: req.flash('error').toString(),
                        success: req.flash('success').toString()
                    });
                    return;
                }
                User.getById(posts[i].userId, function (err, user) {
                    if (err) {
                        i = -1;
                        return;
                    }
                    posts[i].user = user;
                    userlist(i - 1);
                });
            };
            userlist(len-1);

        });
	});

	//login
	app.get('/login', Util.needLogout);
	app.get('/login', function (req, res) {
		res.render('login', {
			page: 'Login',
			user: req.session.user,
			error: req.flash('error').toString(),
			success: req.flash('success').toString()
		});
	});

	app.post('/login', Util.needLogout);
    app.post('/login', function (req, res) {
		var username = req.body.username,
			md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		User.get(username, function (err, user) {
			if (user) {
				if (user.password == password) {
					req.flash("success", "Login successfully.");
					req.session.user = user;
					return res.redirect('/');
				}else{
					req.flash('error', "Password is not correct.");
					return res.redirect('/login');
				}
			}else{
				req.flash('error', "No such user.");
				return res.redirect('/login');
			}
			if (err) {
				req.flash("error", "Internal error.");
				return res.redirect('/');
			}
		});
	});

	//post
    app.get('/post', Util.needLogin);
    app.get('/post', function (req, res) {
		res.render('post', {
			page: 'Post',
			user: req.session.user,
			error: req.flash('error').toString(),
			success: req.flash('success').toString()
		});
	});

	app.post('/post', Util.needLogin);
	app.post('/post', function (req, res) {
	    var currentUser = req.session.user,
            post = new Post(null, currentUser._id, req.body.title, req.body.content, new Date());
	    post.save(function (err) {
	        if (err) {
	            req.flash("error", err);
	            return res.redirect("/");
	        }
	        req.flash("success", "Publish successfully!");
	        return res.redirect("/");
	    });
	});

	//logout
	app.get('/logout', Util.needLogin);
	app.get('/logout', function (req, res) {
		req.session.user = null;
		req.flash('success', "Logout successfully.");
		return res.redirect('/login');
	});

	//register
	app.get('/reg', Util.needLogout);
	app.get('/reg', function (req, res) {
		res.render('reg', {
			page: 'Register',
			user: req.session.user,
			error: req.flash('error').toString(),
			success: req.flash('success').toString()
		});
	});

	app.post('/reg', Util.needLogout);
	app.post('/reg', function (req, res) {
		var username = req.body.username,
			password = req.body.password,
			password_re = req.body['password-repeat'];

		if (password != password_re) {
			req.flash('error','passwords are not the same. Please try again.');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		var newUser = new User({
			username: req.body.username,
			password: password,
			email: req.body.email
		});

		User.get(newUser.username, function (err, user) {
			if (user) {
				req.flash('error','user already exist.');
				return res.redirect('/reg');
			}
			newUser.save(function (err, user) {
				if (err) {
					req.flash('error',user);
					return res.redirect('/reg');
				}
				req.session.user = user;
				req.flash('success','Registered!')
				return res.redirect('/');
			});
		});
	});

	app.post("/upload", Util.needLogin);
	app.post("/upload", function (req, res) {
	    for (var i in req.files) {
	        if (req.files[i].size == 0) {
	            fs.unlinkSync(req.files[i].path);
	            console.log("A empty file detected");
	        } else {
	            var target_path = './public/images/' + req.files[i].name;
	            fs.renameSync(req.files[i].path, target_path);
	            console.log("Upload a image");
	        }
	    }
        
	    req.flash("success", "Upload success.");
	    res.redirect("/upload");
	});

	app.get("/upload", Util.needLogin);
	app.get("/upload", function (req, res) {

	    res.render('upload', {
	        page: 'Upload',
	        user: req.session.user,
	        error: req.flash('error').toString(),
	        success: req.flash('success').toString()
	    });
	});

	app.get("/u/:uid", function (req, res) {
	    var uid = req.param("uid"),
            user;
	    Async.waterfall([function (callback) {
	        User.getById(uid, callback);
	    }, function (_user, callback) {
	        if (_user) {
	            user = _user;
	            Post.getByUser(user._id.toString(), function (err, posts) {
	                if (err) {
	                    callback(err);
	                }
	                posts.forEach(function (post) {
	                    post.user = _user;
	                });
	                callback(null, posts);
	            });
	        } else {
	            callback("no such user");
	        }
	    }], function (err, result) {
	        var page = err || user.username + "'s posts";

	        res.render('index', {
	            page: page,
	            posts: result || [],
	            user: req.session.user,
	            error: req.flash('error').toString(),
	            success: req.flash('success').toString()
	        });

	    });
	});

	app.get('/:page', function (req, res) {
		var page = req.param("page");
	    // var uid = "539ebc74d1c4c3f40269034e",
     //        user;
	    // Async.waterfall([function (callback) {
	    //     User.getById(uid, callback);
	    // }, function (_user, callback) {
	    //     if (_user) {
	    //         user = _user;
	    //         Post.getByUser(user._id.toString(), function (err, posts) {
	    //             if (err) {
	    //                 callback(err);
	    //             }
	    //             posts.forEach(function (post) {
	    //                 post.user = _user;
	    //             });
	    //             callback(null, posts);
	    //         });
	    //     } else {
	    //         callback("no such user");
	    //     }
	    // }
	    // ], function (err, result) {
	    //     var page = err || user.username + "'s posts";

	    //     res.render('index', {
	    //         page: page,
	    //         posts: result || [],
	    //         user: req.session.user,
	    //         error: req.flash('error').toString(),
	    //         success: req.flash('success').toString()
	    //     });

	    // });
result = null;
	        res.render('index', {
	            page: page,
	            posts: result || [],
	            user: req.session.user,
	            error: req.flash('error').toString(),
	            success: req.flash('success').toString()
	        });

	    //User.getById("539ebc74d1c4c3f40269034e",function(err, user){
	    //    console.log(user);
	    //    res.render('reg', {
	    //        page: 'Register',
	    //        user: req.session.user,
	    //        error: req.flash('error').toString(),
	    //        success: req.flash('success').toString()
	    //    });
	    //});
	});
}

// req.flash 改为 res.locals.xx = xx
