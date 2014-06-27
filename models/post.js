var mongodb = require('./db.js'),
	ObjectID = require('mongodb').ObjectID,
    markdown = require('markdown').markdown;

function Post(_id, userId, title, content, time) {
    this._id = _id;
    this.userId = userId;
	this.title = title;
	this.content = content;
	this.time = time;
}

module.exports = Post;

Post.prototype.save = function (callback) {
    var post = {
        userId: new ObjectID(this.userId),
        title: this.title,
        content: this.content,
        time: this.time
    };
    mongodb.get(function (db) {
        db.collection("posts", function (err, collection) {
            if (err) {
                return callback(err);
            }
            collection.insert(post, { safe: true }, function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

Post.get = function (id, callback) {
    mongodb.get(function (db) {
        db.collection("posts", function (err, collection) {
            if (err) {
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectID(id);
            }
            collection.find(query).sort({ time: -1 }).toArray(function (err, docs) {
                if (err) {
                    return callback(err);
                }
                docs.forEach(function (doc) {
                    doc.content = markdown.toHTML(doc.content);
                });
                callback(null, docs);
            });
        });
    });
};

Post.getByUser = function (uid, callback) {
    mongodb.get(function (db) {
        db.collection("posts", function (err, collection) {
            if (err) {
                return callback(err);
            }
            var query = {};
            if (uid) {
                query.userId = new ObjectID(uid);
            }
            collection.find(query).sort({ time: -1 }).toArray(function (err, docs) {
                if (err) {
                    return callback(err);
                }
                docs.forEach(function (doc) {
                    doc.content = markdown.toHTML(doc.content);
                });
                callback(null, docs);
            });
        });
    });
};