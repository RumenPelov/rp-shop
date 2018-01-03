var express = require('express'),
	expressJwt = require('express-jwt'),
	jwt = require('jsonwebtoken'),
	UserDAO = require('./services/user').UserDAO;

var EXP_MIN=30,
	JWT_SECRET=process.env.JWT_SECRET;

function AuthRouts(database){
	"use strict";

	
	var users = new UserDAO(database);
	
	this.router = express.Router();
	
	this.router.post('/login', function (req, res, next) {
		"use strict";

		var username = req.body.username;
		var password = req.body.password;

		users.validate_login(username, password, function(user_record) {
			
			if (user_record!= null ){
				// username is stored in the user collection in the _id key
				
				var profile ={
					username:user_record['_id']
				}
				if(user_record['email']){
					profile['email']=user_record['email'];
				}
				
				var token = jwt.sign(profile, JWT_SECRET, { expiresIn: 60*EXP_MIN });
					
					res.status(201).json({
						username:user_record['_id'],
						token: token
					});	
			}else {							
				res.status(401).json({
					username: username,
					login_error:"Invalid Login"
				});	
			}
		});	
	});		
		
	this.router.post('/signup', function(req, res) {
        "use strict";

		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;
		
		var profile ={ username:username };
		if(email){
			profile['email']=email;
		}

		users.add_user(username, password, email, function(success){
			if (!success){
				// this was a duplicate
				
				res.status(401).json({
					username_error:"Username already in use. Please choose another one"
				});				
			}else{
				
				var token = jwt.sign(profile, JWT_SECRET, { expiresIn: 60*EXP_MIN });
				
				res.status(201).json({
					username: username,
					token: token
				});			
			}			
		});	
	});				
}

module.exports.AuthRouts = AuthRouts;