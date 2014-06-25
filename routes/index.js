/* GET home page. */
var crypto = require('crypto'),
	User = require('../models/user.js');
module.exports = function(app) {
	app.get('/', function (req, res) {
		res.render('index', {
			title: 'HomePage',
			user: req.session.user,
			error: req.flash('error').toString(),
			success: req.flash('success').toString()
		});
	});

	//login

	app.get('/login', function (req, res) {
		res.render('login', {
			title: 'Login',
			user: req.session.user,
			error: req.flash('error').toString(),
			success: req.flash('success').toString()
		});
	});

	app.post('/login', function (req, res) {
		var username = req.body.username,
			md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		User.get(username, function (err, user) {
			if (user) {
				if (user.password == password) {
					req.flash("success", "Login successfully.");
					req.session.user = user;
					res.redirect('/');
				}else{
					req.flash('error', "Password is not correct.");
					res.redirect('/login');
				}
			}else{
				req.flash('error', "No such user.");
				res.redirect('/login');
			}
			if (err) {
				req.flash("error", "Internal error.");
				res.redirect('/');
			}
		});
	});

	//post

	app.get('/post', function (req, res) {
		res.render('index', {
			title: 'Post',
			user: req.session.user,
			error: req.flash('error').toString(),
			success: req.flash('success').toString()
		});
	});

	app.post('/post', function (req, res) {
	});

	//logout

	app.get('/logout', function (req, res) {
		req.session.user = null;
		req.flash('success', "Logout successfully.");
		return res.redirect('/login');
	});

	//register

	app.get('/reg', function (req, res) {
		res.render('reg', {
			title: 'Register',
			user: req.session.user,
			error: req.flash('error').toString(),
			success: req.flash('success').toString()
		});
	});

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

		User.get(newUser.username, function (err, user){
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
				res.redirect('/');
			});
		});
	});
	app.get('/info',function (req,res) {
		req.flash('error',"error");
		res.render('reg', {
			title: 'Register',
			user: req.session.user,
			error: req.flash('error').toString(),
			success: req.flash('success').toString()
		});
	})
}

// req.flash 改为 res.locals.xx = xx