/*
  Copyright (c)  2017
*/


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function CartDAO(database) {
    "use strict";

    this.db = database;


    this.getCart = function(userId, callback) {
        "use strict";
		var self = this;
  
		this.db.collection('cart').findOne({_id: userId}, function(err, doc) {
        if(err) throw err;
		
		var userCart = {
            userId: userId,
            items: []
		}
		
		
		if (doc){
			userCart.items=doc.items;
			callback(userCart);
		}else{
			self.db.collection('cart').insertOne({_id: userId, items:[]}, function(err, doc) {
				if(err) throw err;
				//console.log(doc);
				callback(userCart);			
			});
		}

		}); 
		
		
    }


    this.itemInCart = function(userId, itemId, callback) {
        "use strict";


		 
		 
		 this.db.collection('cart').findOne({_id:userId, items:{$elemMatch:{ "_id": itemId } }},{"items.$": 1 } , function(err, doc){
			 
			 assert.equal(null, err);
			 
			 if (doc){
				var item = doc.items[0];
				
				//console.log(item);
			 
				callback(item); 
			 } else {
				 
				 callback(null);
				 
			 }
			 
			 
		 });
		 

    }


    this.addItem = function(userId, item, callback) {
        "use strict";

        // Will update the first document found matching the query document.
        this.db.collection("cart").findOneAndUpdate(
            // query for the cart with the userId passed as a parameter.
            {_id: userId},

            {"$push": {items: item}},

            {
                upsert: true,
                returnOriginal: false
            },
            // Because we specified "returnOriginal: false", this callback
            // will be passed the updated document as the value of result.
            function(err, result) {
                assert.equal(null, err);
                // To get the actual document updated we need to access the
                // value field of the result.
                callback(result.value);
            });


    };


    this.updateQuantity = function(userId, itemId, quantity, callback) {
        "use strict";


		
		 var userCart = {
            userId: userId,
            items: []
        }
		
		if (quantity > 0){
			
			this.db.collection("cart").findOneAndUpdate({ _id:userId, items:{$elemMatch:{ "_id": itemId }}},
			{$set:{"items.$.quantity":quantity}},
			{projection: { "items" : 1 }, returnOriginal: false }, 
			
			function (err, result){
				assert.equal(null, err);
				assert.notEqual(null, result);
				
				//console.log(result.value);
				
				userCart.items= result.value.items;
				
				callback(userCart);
				
			} );
			
		}else if (quantity==0) {
			
			this.db.collection("cart").findOneAndUpdate({ _id:userId},
			{ $pull: { items: { _id: itemId} } },
			{projection: { "items" : 1 }, returnOriginal: false }, 
			
			function (err, result){
				assert.equal(null, err);
				assert.notEqual(null, result);
				
			//	console.log(result.value);
				
				userCart.items= result.value.items;
				
				callback(userCart);
				
			} );
		}
		


    }

    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            quantity: 1,
            reviews: []
        };

        return item;
    }

}


module.exports.CartDAO = CartDAO;
