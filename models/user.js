var mongodb = require("./db.js"),
    ObjectId = require('mongodb').ObjectID;

function User(user) {
    this._id = user._id;
	this.username = user.username;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback) {
    var user = {
		username: this.username,
		password: this.password,
		email: this.email
	};

    mongodb.get(function (db) {

		db.collection('user', function (err, collection) {
			if (err) {
				return callback(err);
			}

			collection.insert(user, {
				safe:true
			}, function (err, user) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, user[0]);
			});
		});
	});
};

User.get = function (username, callback) {
    mongodb.get(function (db) {

		db.collection('user', function (err, collection) {
			if (err) {
				return callback(err);
			};

			collection.findOne({
				username: username
			}, function (err, user) {
				if (err) {
					return callback(err);
				};
				callback(null, user);
			});
		});
	});
};

User.getById = function (userid, callback) {
    mongodb.get(function (db) {

        db.collection('user', function (err, collection) {
            if (err) {
                return callback(err);
            };
            collection.findOne({
                _id:new ObjectId(userid)
            }, function (err, user) {
                if (err) {
                    return callback(err);
                };
                callback(null, user);
            });
        });
    });
};