var Comment = require('./comment.js');
var express = require('express');
var md5 = require("md5");
var User = require("../model/user.js");
var Response = require("../model/response.js");
var error = require("../model/error.js");
var router = express.Router();

