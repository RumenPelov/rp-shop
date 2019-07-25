
function CartDAO(database) {
    "use strict";
    this.db = database;

    this.getCart = async (userId) => {
        "use strict";
        let userCart = { userId, items: [] };
        try{
            const doc = await this.db.collection('cart').findOne({_id: userId});
            if(doc){
                userCart.items=doc.items;
            }else{
            const newcart = await this.db.collection('cart').insertOne({_id: userId, items:[]});
            }

            return new Promise((resolve, reject) => {
				resolve(userCart);
				});
        } catch(error) {
            console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
        }
    }

    this.replaceCart = async (cart, userId) => {
        "use strict"; 
        const items = cart.items,
              addresses = cart.addresses;
        try{
            const result = await this.db.collection("cart").findOneAndUpdate(
                { _id: userId},
                {_id: userId, items, addresses  },
                {upsert: true, returnOriginal: false }); 

            return new Promise((resolve, reject) => {
				resolve(result.value);
				});
        } catch(error) {
            console.log(error.errmsg);
			return new Promise((resolve, reject) => {
				reject(error);
				});
        }
    }

    this.itemInCart = async (userId, itemId) => {
        "use strict";   
        try {
            const doc = await this.db.collection('cart').findOne({_id:userId, items:{$elemMatch:{ "_id": itemId } }},{"items.$": 1 });
            let item = null;	 
            if (doc){
                item = doc.items[0]; 
            }
    
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

    this.addItem = async (userId, item) => {
        "use strict";
        try {
                // Will update the first document found matching the query document.
            const result = await this.db.collection("cart").findOneAndUpdate(
            {_id: userId},{"$push": {items: item}},
            {upsert: true, returnOriginal: false} );
                // Because we specified "returnOriginal: false", this
                // will pass the updated document as the value of result.
            return new Promise((resolve, reject) => {
            resolve(result.value);
            });
        } catch(error) {
            console.log(error.errmsg);
			return new Promise((resolve, reject) => {
                            reject(error);
                        });
        }
    }

    this.updateQuantity = async (userId, itemId, quantity) => {
        "use strict";
        let userCart = { userId, items: [] };
        try {
            if (quantity > 0){
                const result = await this.db.collection("cart").findOneAndUpdate(
                    { _id:userId, items:{$elemMatch:{ "_id": itemId }}},
                    {$set:{"items.$.quantity":quantity}},
                    {projection: { "items" : 1 }, returnOriginal: false }); 
                            
                userCart.items= result.value.items;			
            } else if (quantity==0) {
                const result = await this.db.collection("cart").findOneAndUpdate(
                    { _id:userId}, { $pull: { items: { _id: itemId} } },
                    {projection: { "items" : 1 }, returnOriginal: false }); 
                
                userCart.items= result.value.items;
            } 
    
            return new Promise((resolve, reject) => {
                resolve(userCart);
                });
        } catch(error) {
            console.log(error.errmsg);
			return new Promise((resolve, reject) => {
                            reject(error);
                        });
        }
	}
}

module.exports.CartDAO = CartDAO;




/* createDummyItem = function() {
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
} */