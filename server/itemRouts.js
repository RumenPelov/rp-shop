var express = require('express'),
    ItemDAO = require('./services/items').ItemDAO;

function ItemRouts(database) {
    "use strict";
	var items = new ItemDAO(database);
	this.router = express.Router();

    this.router.get("/:itemId", async function(req, res) {
        "use strict";
        const itemId = parseInt(req.params.itemId);
        try{
            const item = await items.getItem(itemId);
            if (item == null) {
                res.status(404).send("Item not found.");
                return;
            }
            let stars = 0,
                numReviews = 0,
                reviews = [];
            
            if ("reviews" in item) {
                numReviews = item.reviews.length;
    
                for (var i=0; i<numReviews; i++) {
                    let review = item.reviews[i];
                    stars += review.stars;
                }
                if (numReviews > 0) {
                    stars = stars / numReviews;
                    reviews = item.reviews;
                }
            }
            const relatedItems = await items.getRelatedItems(item.category);
                
            res.status(201).json({ 
                        item,
                        stars,
                        reviews,
                        numReviews,
                        relatedItems
                    });
        } catch(error) {
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}    
    });

    this.router.post("/:itemId/reviews",async function(req, res) {
        "use strict";
        const itemId = parseInt(req.params.itemId);
        const review = req.body.review;
        const name = req.body.name;
        const stars = parseInt(req.body.stars);
        try{
            const itemDoc = await items.addReview(itemId, review, name, stars);
            res.status(201).json({ itemId: itemId});
        } catch(error) {
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}    
    });
}

module.exports.ItemRouts = ItemRouts;