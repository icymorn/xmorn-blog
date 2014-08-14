/**
 * Created by v-jiangz on 8/12/2014.
 */
var ObjectID = require('mongodb').ObjectID;
var mongodb = require('./db.js');
/**
 * user model
 * @param {string}username
 * @param {string}password
 * @param id
 */
function User(username, password, id){
    this.username = username;
    this.password = password;
    this.id = id;
}
/**
 * save user
 * @param {Function}callback
 */
User.prototype.save = function (callback) {
    var newUser = {
        username: this.username,
        password: this.password
    };
    // todo: check if is exist.
    mongodb.collection('user', function(err, collection) {
        if (err) {
            return callback(err);
        }
        collection.insert(newUser, {safe: true}, function(err, user) {
            if (err) {
                return callback(err);
            }
            callback(null, user[0]);
        });
    });

};

/**
 * get user by id
 * @param id
 * @param {Function}callback
 */
User.getById = function (id, callback) {
    mongodb.collection('user', function(err, collection) {
        if (err) {
            return callback(err);
        }

        collection.findOne({
            _id: new ObjectID(id)
        }, function (err, user) {
            if (err) {
                return callback(err);
            }
            callback(null, user);
        });
    });
};

/**
 * get user by username
 * @param {String}username
 * @param {Function}callback
 */
User.getByUsername = function (username, callback) {
    mongodb.collection('user', function(err, collection) {
        if (err) {
            return callback(err);
        }

        collection.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return callback(err);
            }
            callback(null, user);
        });
    });
};

module.exports = User;