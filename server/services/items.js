/*
  Copyright (c)  2017
*/


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";


		this.db.collection('item').aggregate([{$group:{_id:"$category", num:{$sum:1 }  } } ]).toArray(function(err, docs) {
        if(err) throw err;

        if (docs.length < 1) {
            console.dir("No documents found");

        }
		
		
		var num=0;
        var categories = [];
		
        
		docs.forEach(function(doc){
			num=num+doc.num;
		}); 
		
		categories=docs.slice();
		
		  var category = {
            _id: "All",
            num: num
        };
		
		categories.push(category);
		
		categories.sort(function(a, b) {
			  var nameA = a._id.toUpperCase(); // ignore upper and lowercase
			  var nameB = b._id.toUpperCase(); // ignore upper and lowercase
			  if (nameA < nameB) {
				return -1;
			  }
			  if (nameA > nameB) {
				return 1;
			  }
			  return 0;
			});
	
		callback(categories);

		
		});
		
	

    }


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";


		 
		 var query={};
		 
		 if(category != "All" ){
			 query.category=category;
		 }
		 
		 var pageItems = [];
		 
		 this.db.collection('item').find(query).sort({_id:1 } ).skip(page*itemsPerPage).limit(itemsPerPage).toArray(function(err, docs) {
			 
				assert.equal(null, err);
				
				var pageItems = [];

				if (docs.length < 1) {
					console.dir("No documents found");
					//return db.close();
				} else {
					
					docs.forEach(function(doc){
					pageItems.push(doc);
					});
					
				}	
			
				callback(pageItems);				
		 });		 
		 

 
    }


    this.getNumItems = function(category, callback) {
        "use strict";

        var numItems = 0;


		 
		 var query={};
		 
		 if(category != "All" ){
			 query.category=category;
		 }
		 
		 this.db.collection('item').find(query).count(function(err, count) {
			assert.equal(null, err);
			
			numItems= count;
			
			callback(numItems);
			//db.close();
		})
		 

    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";


		 
		  this.db.collection('item').find({$text:{$search:query}}).sort({_id:1 } ).skip(page*itemsPerPage).limit(itemsPerPage).toArray(function(err, docs) {
			 
				assert.equal(null, err);
				
				var items = [];

				if (docs.length < 1) {
					console.log("No documents found");
					//return db.close();
				} else {
					
					docs.forEach(function(doc){
					items.push(doc);
					});
					
				}	
			
				callback(items);				
		 });		 
		 
		 

    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;


	
		  this.db.collection('item').find({$text:{$search:query}}).count(function(err, count) {
			 
				assert.equal(null, err);
				
				numItems=count;
			
				callback(numItems);				
		 });
	
    }


    this.getItem = function(itemId, callback) {
        "use strict";


		 this.db.collection('item').findOne({_id:itemId} , function(err, item){
			 
			 assert.equal(null, err);
			 
			 callback(item);
			 
		 });
		 
		 
    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";


        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }
		
		
		try {
		 
		 this.db.collection("item").updateOne({_id:itemId}, { $push: { reviews: reviewDoc } });
		 
		} catch (e) {
		   print(e);
		}
		
		this.db.collection('item').findOne({_id:itemId} , function(err, doc){
			 
			 assert.equal(null, err);
			 
			 callback(doc);
			 
		 });
		

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
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
