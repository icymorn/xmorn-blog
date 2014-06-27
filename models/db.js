var settings = require("../settings.js"),
	db = require("mongodb").Db,
	connection = require('mongodb').Connection,
	server = require("mongodb").Server,
    events = require("events"),
    event = new events.EventEmitter(),
    client = null;



new db(settings.db, new server(settings.host, connection.DEFAULT_PORT), { safe: true }).open(function (err, c) {
    if (!err) {
        client = c;
        console.log("database connected: ");
        event.emit("connect");
    } else {
        console.log("database connection error", err);
        event.emit("error");
    }
});

exports.get = function (fn) {
    if (client) {
        fn(client);
    } else {
        event.on("connect", function () {
            fn(client);
        });
    }
};