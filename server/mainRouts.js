var express = require('express'),
    ItemDAO = require('./services/items').ItemDAO;

const    ITEMS_PER_PAGE = 6;

function MainRouts(database) {
    "use strict";
	let items = new ItemDAO(database);
	this.router = express.Router();

    this.router.get("/main", async function(req, res) {
        "use strict";
        
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const category = req.query.category ? req.query.category : "All";
        try{
            const categories = await items.getCategories(); 
            const pageItems = await items.getItems(category, page, ITEMS_PER_PAGE);
            const itemCount = await items.getNumItems(category);
            let numPages = 0;
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
        } catch(error) {
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}       
    });
    
    this.router.get("/main/search", async function(req, res) {
        "use strict";
        try{
            let page = req.query.page ? parseInt(req.query.page) : 0;
            let query = req.query.query ? req.query.query : "";
    
            const searchItems = await items.searchItems(query, page, ITEMS_PER_PAGE);
            const itemCount = await items.getNumSearchItems(query);
         
            let numPages = 0;   
            if (itemCount > ITEMS_PER_PAGE) {
                numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
            }
            
            res.status(201).json({ 
                                    queryString: query,
                                    itemCount: itemCount,
                                    pages: numPages,
                                    page: page,
                                    items: searchItems });
        } catch(error) {
			res.status(500).json({
				error:"Internal server error. Please try again later"
			});
		}       
    });
}

module.exports.MainRouts = MainRouts;