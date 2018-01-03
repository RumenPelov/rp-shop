var express = require('express'),

    ItemDAO = require('./services/items').ItemDAO;


function ItemRouts(database) {
    "use strict";
    
	var items = new ItemDAO(database);
	
	this.router = express.Router();

    this.router.get("/:itemId", function(req, res) {
        "use strict";

        var itemId = parseInt(req.params.itemId);

        items.getItem(itemId, function(item) {
        // console.log(item);

            if (item == null) {
                res.status(404).send("Item not found.");
                return;
            }
            
            var stars = 0;
            var numReviews = 0;
            var reviews = [];
            
            if ("reviews" in item) {
                numReviews = item.reviews.length;

                for (var i=0; i<numReviews; i++) {
                    var review = item.reviews[i];
                    stars += review.stars;
                }

                if (numReviews > 0) {
                    stars = stars / numReviews;
                    reviews = item.reviews;
                }
            }

            items.getRelatedItems(function(relatedItems) {
                
                res.status(201).json({ 
                            item: item,
                            stars: stars,
                            reviews: reviews,
                            numReviews: numReviews,
                            relatedItems: relatedItems
                        });
            });
        });
    });

    this.router.post("/:itemId/reviews", function(req, res) {
        "use strict";

        var itemId = parseInt(req.params.itemId);
        var review = req.body.review;
        var name = req.body.name;
        var stars = parseInt(req.body.stars);

        items.addReview(itemId, review, name, stars, function(itemDoc) {
            res.status(201).json({ itemId: itemId});
        });
    });

    
}

module.exports.ItemRouts = ItemRouts;