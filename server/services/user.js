
var SHA256 = require("crypto-js/sha256");
assert = require('assert');


function UserDAO(database) {
    "use strict";

    this.db = database;


this.make_pw_hash= function(pw, salt){
	if(salt==null){
		salt=randomString(6);
	}
	
	return SHA256(pw+salt)+","+salt;
}

this.validate_login= function(username, password, callback){
	var self=this;
	
	
	this.db.collection('users').findOne({_id:username}, function(err, user){
		assert.equal(null, err);
		
		if (user==null) {
				console.dir("No user found");
					
				callback(null);
				//return db.close();
		} else {
				var salt = user["password"].split(',')[1];
				if (user['password'] != self.make_pw_hash(password, salt)){
						
					console.log("user password is not a match");
					callback(null);
				} else{
					callback(user);
				}
       
		}
		
	});
}

this.add_user= function(username, password, email, callback){
	var password_hash= this.make_pw_hash(password);
	var user = {'_id': username, 'password': password_hash}
    if(email != ""){
		user['email'] = email;
	}
	
	this.db.collection('users').insertOne( user, 
		function(err, result){
			if(err){ 
				console.log(err.errmsg);
				callback(false);
			}else{
				console.log("Inserted a document into the users collection.");
				callback(true);
			}

	});
	
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