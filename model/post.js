/**
 * Created by v-jiangz on 8/12/2014.
 */
var ObjectID = require('mongodb').ObjectID;
var mongodb = require('./db.js');

function Post(title, content, userId, time, catalog, views, tags, private, allowComment, id) {
    this.title = title;
    this.content = content;
    this.userId = userId;
    this.time = time;
    this.catalog = catalog;
    this.views = views;
    this.tags = tags;
    this.private = private;
    this.allowComment = allowComment;
    this._id = id;
}

/**
 * save post
 * @param callback
 */
Post.prototype.save = function (callback) {
    var post = {
        title :this.title,
        content :this.content,
        userId :this.userId,
        time :this.time,
        catalog :this.catalog,
        views :this.views,
        tags :this.tags,
        'private': this.private,
        allowComment: this.allowComment
    };
    // todo: check if is exist.
    mongodb.collection('post', function(err, collection) {
        if (err) {
            return callback(err);
        }
        collection.insert(post, {safe: true}, function(err, post) {
            if (err) {
                return callback(err);
            }
            callback(null, post[0]);
        });
    });
};

Post.deleteById = function(id, callback) {
    mongodb.collection('post', function(err, collection) {
        if (err) {
            return callback(err);
        }
        collection.remove({_id: ObjectID(id)}, function(err) {
            callback(err);
        });
    });
}

Post.prototype.update = function (callback) {
    var post = {
        title :this.title,
        content :this.content,
        catalog :this.catalog,
        tags :this.tags,
        allowComment: this.allowComment,
        'private': this.private
    };
    var id = this._id;
    // todo: check if is exist.

    mongodb.collection('post', function(err, collection) {
        if (err) {
            return callback(err);
        }
        collection.update({ _id: ObjectID(id) }, { $set: post }, function(err) {
            return callback(err);
        });
    });
};

/**
 * get post by id
 * @param id
 * @param {Function}callback
 */
Post.getById = function (id, callback) {
    mongodb.collection('post', function(err, collection) {
        if (err) {
            return callback(err);
        }

        collection.findOne({
            _id: ObjectID(id)
        }, function (err, post) {
            if (err) {
                return callback(err);
            }

            callback(null, post);
        });
    });
};

/**
 * get post by username
 * @param {String}username
 * @param {Function}callback
 */
Post.getByTitle = function (title, callback) {
    mongodb.collection('post', function(err, collection) {
        if (err) {
            return callback(err);
        }

        collection.findOne({
            title: title
        }, function (err, post) {
            if (err) {
                return callback(err);
            }
            callback(null, post);
        });
    });
};

/**
 * get posts from a offset
 * @param {Number}offset
 * @param {Number}count
 * @param {String}catalog
 * @param {String}tags
 * @param {Function}callback
 */
Post.get = function (offset, count, callback) {
    mongodb.collection('post', function(err, collection) {

        if (err) {
            return callback(err);
        }

        var cursor = collection.find().sort({time: -1});
        cursor.count(false, function(err, totalNumber){
            cursor.skip(offset).limit(count).toArray(function(err, posts) {
                if (err) {
                    console.error(err);
                    return callback(err);
                } else {
                    callback(null, {posts: posts, count: totalNumber});
                }
            });
        });

    });
};

/**
 * the post id to be added
 * @param id
 */
Post.addPV = function(id) {
    mongodb.collection('post', function(err, collection) {
        collection.update({ _id: ObjectID(id) }, { $inc: { views: 1}}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
};

module.exports = Post;