

function ItemDAO(database) {
    "use strict";
    this.db = database;

    this.getCategories = async () => {
        "use strict";
		try {
			const docs = await this.db.collection('item')
				.aggregate([{$group:{_id:"$category", num:{$sum:1 }  } } ])
				.toArray();

			if (docs.length < 1) {
				console.dir("No documents found");
			}		
			let num=0,
				categories = docs.slice();
				
			docs.forEach(function(doc){
				num=num+doc.num;
			}); 
			categories.push({ _id: "All", num });
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

			return new Promise((resolve, reject) => {
				resolve(categories);
			});
		} catch(error) {
			console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
		}
    }

    this.getItems = async (category, page, itemsPerPage) => {
        "use strict";
		let query={};
		 
		if(category != "All" ){
		query.category=category;
		}
		try{
			const docs = await this.db.collection('item').find(query)
			.sort({_id:1 } )
			.skip(page*itemsPerPage)
			.limit(itemsPerPage)
			.toArray();

			let pageItems = [];
			if (docs.length < 1) {
				console.dir("No documents found");
			} else {
				docs.forEach(function(doc){
				pageItems.push(doc);
				});
			}	

			return new Promise((resolve, reject) => {
				resolve(pageItems);
			});
		} catch(error) {
			console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
		} 
    }

    this.getNumItems = async (category) => {
        "use strict";
        let query={};
		if(category != "All" ){
			query.category=category;
		}
		try {
			const count = await this.db.collection('item').find(query).count();
		
			return new Promise((resolve, reject) => {
				resolve(count);
			});
		} catch(error) {
			console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
		} 
    }


    this.searchItems = async (query, page, itemsPerPage) => {
        "use strict";		 
		try{
			const docs = await this.db.collection('item')
						.find({$text:{$search:query}})
						.sort({_id:1 } )
						.skip(page*itemsPerPage)
						.limit(itemsPerPage)
						.toArray();
	
			if (docs.length < 1) {
				console.log("No documents found");
			}

			return new Promise((resolve, reject) => {
				resolve(docs);
			});
		} catch(error) {
			console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
		}
    }

    this.getNumSearchItems = async (query) => {
        "use strict";
		try{
			const count = await this.db.collection('item')
					.find({$text:{$search:query}})
					.count();
			
			return new Promise((resolve, reject) => {
				resolve(count);
			});
		} catch(error) {
			console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
		}
    }

    this.getItem = async (itemId) => {
		"use strict";
		try {
			const item = await this.db.collection('item').findOne({_id:itemId});
		
			return new Promise((resolve, reject) => {
					resolve(item);
				});
		} catch(error) {
            console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
        } 
    }

    this.getRelatedItems = async () => {
        "use strict";
		try{
			const relatedItems = await this.db.collection("item")
								.find({})
								.limit(4)
								.toArray();
			
			return new Promise((resolve, reject) => {
				resolve(relatedItems);
			});
		} catch(error) {
            console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
        } 
    };

    this.addReview = async (itemId, comment, name, stars) => {
        "use strict";
        let reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }
		try {
			await this.db.collection("item").updateOne({_id:itemId}, { $push: { reviews: reviewDoc } });
			const doc = await this.db.collection('item').findOne({_id:itemId});

			return new Promise((resolve, reject) => {
				resolve(doc);
			});
		} catch(error) {
            console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
        } 
    }
}

module.exports.ItemDAO = ItemDAO;

