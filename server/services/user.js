
var SHA256 = require("crypto-js/sha256");

function UserDAO(database) {
    "use strict";
    this.db = database;

	this.make_pw_hash= function(pw, salt){
		if(salt==null){
			salt=randomString(6);
		}
		return SHA256(pw+salt)+","+salt;
	}

	this.validate_login= async (username, password) => {
		try {
			let res=null;
			const user = await this.db.collection('users').findOne({_id:username});

			if(user != null) {
				let salt = user["password"].split(',')[1];
				if(user['password'] === this.make_pw_hash(password, salt)){
					res=user;
				} else {
					console.log("user password is not a match");
				}
			}
			return new Promise((resolve, reject) => {
				resolve(res);
				});
		} catch(error) {
			console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
		}
	}

	this.add_user= async (username, password, email) => {

		let password_hash= this.make_pw_hash(password);
		let user = {'_id': username, 'password': password_hash}
		if(email !== ""){
			user['email'] = email;
		}
		try{
			const res = await this.db.collection('users').insertOne( user );
			console.log("Inserted a document into the users collection.");
			return new Promise((resolve, reject) => {
				resolve(true);
				});
		} catch (error) {
			return new Promise((resolve, reject) => {
				if(error.code == 11000){
					resolve(false);
				}else {
					console.log(error.errmsg);
					reject(error);
				}
			});
		}	
	}
}

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

module.exports.UserDAO=UserDAO;