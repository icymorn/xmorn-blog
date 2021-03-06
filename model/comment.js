/**
 * Created by v-jiangz on 8/12/2014.
 */
var ObjectID = require('mongodb').ObjectID;
var mongodb = require('./db.js');

/**
 *
 * @param email
 * @param username
 * @param time
 * @param postId
 * @param content
 * @constructor
 */
function Comment(email, username, time, postId, content, header){
    this.email = email;
    this.username = username;
    this.time = time;
    this.postId = postId;
    this.content = content;
    this.header = header;
}
/**
 * save comment
 * @param {Function}callback
 */
Comment.prototype.save = function (callback) {
    var newComment = {
        email: this.email,
        username: this.username,
        time: this.time,
        postId: this.postId,
        content: this.content,
        header: this.header
    };
    // todo: check if is exist.
    mongodb.collection('comment', function(err, collection) {
        if (err) {
            return callback(err);
        }

        collection.insert(newComment, {safe: true}, function(err, comment) {
            if (err) {
                return callback(err);
            }
            callback(null, comment[0]);
        });
    });

};

/**
 * get user by id
 * @param id
 * @param {Function}callback
 */
Comment.getByPostId = function (id, callback) {
    mongodb.collection('comment', function(err, collection) {
        if (err) {
            return callback(err);
        }

        var cursor = collection.find({postId: id});
        cursor.toArray(function(err, comments) {
            if (err) {
                console.error(err);
                return callback(err);
            } else {
                callback(null, comments);
            }
        });

    });
};

Comment.deleteAllFromPost = function( postID, callback) {
    mongodb.collection('comment', function(err, collection) {
        if (err) {
            return callback(err);
        }

        collection.remove({postId: ObjectID(postID)}, function(err){
            callback(err);
        });

    });
};

Comment.deleteById = function(id, callback) {
    mongodb.collection('comment', function(err, collection) {
        if (err) {
            return callback(err);
        }

        collection.remove({_id: ObjectID(id)}, function(err){
            callback(err);
        });
    });
};

module.exports = Comment;