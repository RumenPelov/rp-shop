var express = require('express'),

    ItemDAO = require('./services/items').ItemDAO;

const    ITEMS_PER_PAGE = 5;

function MainRouts(database) {
    "use strict";
    
	var items = new ItemDAO(database);
	
	this.router = express.Router();

   
    this.router.get("/main", function(req, res) {
        "use strict";
        
        var page = req.query.page ? parseInt(req.query.page) : 0;
        var category = req.query.category ? req.query.category : "All";

        items.getCategories(function(categories) {
            
            items.getItems(category, page, ITEMS_PER_PAGE, function(pageItems) {

                items.getNumItems(category, function(itemCount) {

                    var numPages = 0;
                    if (itemCount > ITEMS_PER_PAGE) {
                        numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
                    }

                    res.status(201).json({
                        category_param: category,
                        categories: categories,
                        itemCount: itemCount,
                        pages: numPages,
                        page: page,
                        items: pageItems
                    });	
                
                    
                });
            });
        });
    });
    
    this.router.get("/main/search", function(req, res) {
        "use strict";

        var page = req.query.page ? parseInt(req.query.page) : 0;
        var query = req.query.query ? req.query.query : "";

        items.searchItems(query, page, ITEMS_PER_PAGE, function(searchItems) {

            items.getNumSearchItems(query, function(itemCount) {

                var numPages = 0;
                
                if (itemCount > ITEMS_PER_PAGE) {
                    numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
                }
                
                res.status(201).json({ 
                                       queryString: query,
                                       itemCount: itemCount,
                                       pages: numPages,
                                       page: page,
                                       items: searchItems });
                
            });
        });
    });

}

module.exports.MainRouts = MainRouts;