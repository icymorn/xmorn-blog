/**
 * Created by moe on 8/10/14.
 */

// Module dependencies.
var express = require('express');

var app = express();

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(3000);