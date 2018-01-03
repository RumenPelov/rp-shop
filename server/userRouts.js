var express = require('express'),
	expressJwt = require('express-jwt'),
	jwt = require('jsonwebtoken'),

	ItemDAO = require('./services/items').ItemDAO,
	CartDAO = require('./services/cart').CartDAO;



function UserRouts(database) {
	"use strict";

	
	var items = new ItemDAO(database);
	var cart = new CartDAO(database);
	
	this.router = express.Router();
	
	
	this.router.get("/:userId/cart", function(req, res) {
        "use strict";

        var userId = req.params.userId;
        cart.getCart(userId, function(userCart) {
            var total = cartTotal(userCart);
            res.status(201).json({
                           username: userId,
                           updated: false,
                           cart: userCart,
                           total: total
                       });
        });
    });
	
	this.router.post("/:userId/cart/:itemId/quantity", function(req, res) {
        "use strict";
        
        var userId = req.params.userId;
        var itemId = parseInt(req.params.itemId);
        var quantity = parseInt(req.body.quantity);

        cart.updateQuantity(userId, itemId, quantity, function(userCart) {
            var total = cartTotal(userCart);
            res.status(201).json({
                           username: userId,
                           updated: true,
                           cart: userCart,
                           total: total
                       });
        });
    });
	
	
	   this. router.post("/:userId/cart/items/:itemId", function(req, res) {
        "use strict";

        var userId = req.params.userId;
        var itemId = parseInt(req.params.itemId);

        var renderCart = function(userCart) {
            var total = cartTotal(userCart);
            res.status(201).json({
                           username: userId,
                           updated: true,
                           cart: userCart,
                           total: total
                       });
        };

        cart.itemInCart(userId, itemId, function(item) {
            if (item == null) {
                items.getItem(itemId, function(item) {
                    item.quantity = 1;
                    cart.addItem(userId, item, function(userCart) {
                        renderCart(userCart);
                    });
            
                });
            } else {
                cart.updateQuantity(userId, itemId, item.quantity+1, function(userCart) {
                    renderCart(userCart);
                });
            }
        });
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