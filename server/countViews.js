var express = require('express');

function countViews(database) {
    "use strict";

    this.db=database;
	this.visited = "";
    this.router = express.Router();

        // this is just a reminder that visits collection is capped 
    const createCollection = (req, res, next) => {
        this.db.createCollection("visits", { capped: true, size: 100000});
        next();
    }

    const saveVisit = async (req, res, next) => {
        "use strict";
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        const date = new Date().toDateString();
        const visited = date + ip;
        if (this.visited!== visited) {

            this.visited = visited;

            const visit = { _id: visited };
            try {
                await this.db.collection('visits').insertOne(visit);
                console.log("Inserted a document into the visits collection.");
            } catch(error) {
                console.log(error.errmsg);
            };
        }
        next();
    }

    this.router.use(saveVisit);
}

module.exports = countViews;