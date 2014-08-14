/**
 * Created by v-jiangz on 8/12/2014.
 */

var settings = require('../setting.js').db;
var db = require('mongodb').Db;
var connection = require('mongodb').Connection;
var server = require('mongodb').Server;
var events = require('events');
var event = new events.EventEmitter();
var client = null;

new db(settings.name, new server(settings.host, connection.DEFAULT_PORT), {safe: true}).open(function (err, c) {
    if (!err) {
        client = c;
        console.log('database connected.');
        event.emit('connect');
    } else {
        console.error('database connected error:'. err);
        event.emit('error');
    }
});

module.exports.get = function(fn) {
    if (client) {
        fn(client);
    } else {
        event.on('connect', function(){
            fn(client);
        });
    }
};

module.exports.collection = function(collection, callback) {
    if (client) {
        client.collection(collection, {safe: true}, callback);
    } else {
        event.on('connect', function(){
            client.collection(collection, {safe: true}, callback);
        });
    }
};