var express = require('express'),
bodyParser = require('body-parser')
expressJwt = require('express-jwt'),
jwt = require('jsonwebtoken'),
path = require('path'),
config = require('./server/services/config'),

MongoClient = require('mongodb').MongoClient,
assert = require('assert'),
ItemDAO = require('./server/services/items').ItemDAO,
AuthRouts = require('./server/authRouts').AuthRouts,
UserRouts = require('./server/userRouts').UserRouts,
ItemRouts = require('./server/itemRouts').ItemRouts,
MainRouts = require('./server/mainRouts').MainRouts;
countViews = require('./server/countViews');

// Set up express
app = express();

var port = process.env.PORT || 5000,
    JWT_SECRET=process.env.JWT_SECRET;

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200', 'http://localhost:5000', 'https://rp-shop.herokuapp.com');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', "Content-Type,X-CSRF-Token, Set-Cookie, Cookie, Authorization, *");
  next();
});
 
app.use('/user', expressJwt({secret: JWT_SECRET}));
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 // Point static path to dist
app.use(express.static(path.join(__dirname, 'dist','Mongoshop')));

MongoClient.connect('mongodb://localhost:27017/mongomart', function(err, db) {
    
// MongoClient.connect(config.getDbConnectionString(), function(err, db) {
    "use strict";

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");
    
    var auth= new AuthRouts(db);
    var user= new UserRouts(db);
    var item= new ItemRouts(db);
    var main= new MainRouts(db);
    var count = new countViews(db);
    app.use(count.router);
                
    app.use('/item', item.router);
    app.use('/auth', auth.router);
    app.use('/user', user.router);
    app.use('/', main.router);

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'Mongoshop','index.html'));
      });

    // Start the server listening
    var server = app.listen(port, function() {
        var portenv = server.address().port;
        console.log('Mongoshop server listening on port %s.', portenv);
    });
});