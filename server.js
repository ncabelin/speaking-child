// Speaking Child RESTful API with Token based auth

var express = require('express'),
		app = express();
		mongoose = require('mongoose'),
		morgan = require('morgan'),
		bodyParser = require('body-parser'),
		port = process.env.PORT || 8080;
		ip = process.env.IP;
		connection = require('./app_api/config/config'),
		routesApi = require('./app_api/routes/routes'),
		passport = require('passport'),
		config = require('./app_api/config/passport');

mongoose.connect(connection().mongodb_uri);

function requireHTTPS(req, res, next) {
	// forces https on web browsers where 
	// it is not automatic (e.g. chrome)
	if (req.get('host') == 'localhost:8080') {
		return next();
	}

	if (!req.secure && req.get('x-forwarded-proto') !== 'https' 
		&& process.env.NODE_ENV !== 'development') {
		return res.redirect('https://' + req.get('host') + req.url);
	}
}

app.use(requireHTTPS);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app_client'));
app.use(passport.initialize());
app.use(routesApi);
app.use(function(err, req, res, next) {
	if (err.name == 'UnauthorizedError') {
		res.status(401).json({ 'message': err.name + ':'
			+ err.message });
	}
});

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/app_client/index.html');
});

app.listen(port, ip, function() {
	console.log('Server started at port :' + port);
});