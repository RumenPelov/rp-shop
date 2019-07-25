var express = require('express'),
    expressJwt = require('express-jwt'),
    jwt = require('jsonwebtoken'),
    UserDAO = require('./services/user').UserDAO;

var EXP_MIN=30,
	EXP_MIN_GUEST=60,
	 JWT_SECRET=process.env.JWT_SECRET;

function AuthRouts(database){
	"use strict";

	var users = new UserDAO(database);
	
	this.router = express.Router();
	
	this.router.post('/login', async function (req, res, next) {
		"use strict";

		let username = req.body.username;
		let password = req.body.password;

		try{
			const user = await users.validate_login(username, password);
			
			if (user!== null ){
				// username is stored in the user collection in the _id key
				let profile ={ username: user['_id'] }
	
				if(user['email']){
					profile['email']=user['email'];
				}
				
				let token = jwt.sign(profile, JWT_SECRET, { expiresIn: 60*EXP_MIN });
					
				res.status(201).json({
					username:user['_id'],
					token: token
				});	
			}else {							
				res.status(401).json({
					username: username,
					login_error:"Invalid Login"
				});	
			}
		} catch(error) {
			res.status(500).json({
				login_error:"Internal server error try later"
			});
		}
	});		
		
	this.router.post('/signup', async function(req, res) {
        "use strict";

		let email = req.body.email;
		let username = req.body.username;
		let password = req.body.password;
		
		let profile ={ username:username };
		if(email){
			profile['email']=email;
		}
		try{
			const success = await users.add_user(username, password, email);
			
			if (success){
				let token = jwt.sign(profile, JWT_SECRET, { expiresIn: 60*EXP_MIN });
				res.status(201).json({
					username: username,
					token: token
				});
			} else {
				// this was a duplicate
				res.status(401).json({
					username_error:"Username already in use. Please choose another one"
				});
			}
		} catch(error) {
			res.status(500).json({
				username_error:"Internal server error. Please try again later"
			});
		}
	});		
}

module.exports.AuthRouts = AuthRouts;
