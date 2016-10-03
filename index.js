var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var util = require('util');
var app = require('./app');
const config = require(`./config.json`);

server.use(bodyParser.json());

server.post('/', function (req, res) {
	app.talkToSlack(req.body);
	res.end();
});

var port = config.listenPort;
server.listen(port, function () {
	console.log(`The app has started and is running on :${port}`);
});