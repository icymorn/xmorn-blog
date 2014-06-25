var settings = require("../settings.js"),
	db = require("mongodb").Db,
	connection = require('mongodb').Connection,
	server = require("mongodb").Server;

module.exports = new db(settings.db, new server(settings.host, connection.DEFAULT_PORT), {safe: true});