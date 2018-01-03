

function SessionDAO(database){
	this.db=database;
	
	this.start_session = function(username, callback){
		var session_id = randomString(32);
        var session = {'username': username, '_id': session_id}
		
		this.db.collection('sessions').insertOne( session, 
		function(err, result){
			if(err){ 
				console.log(err.errmsg);
				callback(false);
			}else{
				console.log("Inserted a document into the session collection.");
				callback(result.insertedId);
			}

		});
		
	}
	
	this.end_session = function (session_id, callback){
		
		if (session_id){
			this.db.collection('sessions').deleteOne( {"_id":session_id }, 
			function(err, result){
			if(err){ 
				console.log(err.errmsg);
				callback(err, null);
			}else if(result.result.n==1){
				console.log("session deleted");
				callback(null, result);
			}else{
				var date=new Date();
				console.log(`could not delete session for ${session_id} ${date}`);
				callback(null, null);
			}
				
		});
			
		}else {
			callback(null, null);
		}
		
	}
	
	// if there is a valid session, it is returned
	this.get_session =function (session_id, callback){
		if (session_id){
			this.db.collection('sessions').findOne( {"_id":session_id }, 
			function(err, doc){
			if(err){ 
				callback(err, null);
			}else{
				callback(null, doc);
			}
		});
			
		}else {
			callback(null, null);
		}
	}
	
	// get the username of the current session
	this.get_username =function (session_id, callback){
		
		this.get_session(session_id, function(err, session){
			if(err!=null){
				callback(err, null);
			}else if(session!=null){
				callback(null, session["username"] );
			}else{
				callback(null, null);
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

module.exports.SessionDAO=SessionDAO;