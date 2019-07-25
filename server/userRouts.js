var express = require('express'),
	ItemDAO = require('./services/items').ItemDAO,
    CartDAO = require('./services/cart').CartDAO;
    BillingDAO = require('./services/billing').BillingDAO;

function UserRouts(database) {
	"use strict";

	let items = new ItemDAO(database);
    let cart = new CartDAO(database);
    let billing = new BillingDAO(database);
	
	this.router = express.Router();
	
	this.router.get("/:userId/cart", async function(req, res) {
        "use strict";
        let userId = req.params.userId;
        try{
            const userCart = await cart.getCart(userId);
            const total = cartTotal(userCart);

            res.status(201).json({
                    username: userId,
                    updated: false,
                    items: userCart.items,
                    total: total
                });
        } catch(error) {
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}
    });

    this.router.put("/:userId/cart/update", async function(req, res) {
        "use strict";
        const userId = req.params.userId,
                reqCart = req.body.cart;

        try{
            const userCart = await cart.replaceCart(reqCart, userId);
            const total = cartTotal(userCart);

            res.status(201).json({
                    username: userId,
                    updated: false,
                    items: userCart.items,
                    addresses: userCart.addresses,
                    total: total
                });
        } catch(error) {
            console.log(error);
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}
    });
	
	this.router.post("/:userId/cart/:itemId/quantity", async function(req, res) {
        "use strict";
        
        const userId = req.params.userId;
        const itemId = parseInt(req.params.itemId);
        const quantity = parseInt(req.body.quantity);
        try {
            const userCart= await cart.updateQuantity(userId, itemId, quantity);
            let total = cartTotal(userCart);
    
            res.status(201).json({
                    username: userId,
                    updated: true,
                    items: userCart.items,
                    total: total
                });
        } catch(error) {
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}
    });
	
    this. router.post("/:userId/cart/items/:itemId", async function(req, res) {
        "use strict";
        const userId = req.params.userId;
        const itemId = parseInt(req.params.itemId);
        let userCart;
        try{
            const item = await cart.itemInCart(userId, itemId);
            if (item == null) {
                let item = await items.getItem(itemId);
                item.quantity = 1;
                userCart = await cart.addItem(userId, item);           
            } else {
                userCart = await cart.updateQuantity(userId, itemId, item.quantity+1);
            }
            const total = cartTotal(userCart);

            res.status(201).json({
                username: userId,
                updated: true,
                items: userCart.items,
                total: total
            });
        } catch(error) {
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}
    });


    this.router.post("/:userId/billing", async function(req, res) {
        "use strict";
        
        const userId = req.params.userId;
 
        try {
            const charge= await billing.proccessBilling(req.body, userId);

           // console.log(charge);

            res.status(200).json( charge );
            
        } catch(error) {
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}
    });
    
}

function cartTotal(userCart) {
    "use strict";
    var total = 0;
    for (var i=0; i<userCart.items.length; i++) {
        var item = userCart.items[i];
        total += item.price * item.quantity;
    }
    return total;
}

module.exports.UserRouts = UserRouts;