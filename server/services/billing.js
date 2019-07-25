let config = require('./config/stripe');


function BillingDAO(database) {
    "use strict";
    this.db = database;

    const stripe = require('stripe')(config.stripeSecretKey);

    this.proccessBilling = async (body, userId) => {
        "use strict";
        
        let {token, amount, name, email, address, items} = body;
        amount = parseInt(amount*100);

        try{
            const charge = await stripe.charges.create({
                amount: amount ,
                currency: 'usd',
                source: token.id,
                receipt_email: email,
                description: 'MongoShop charge',
            });  

            if(charge.amount === amount && charge.status === "succeeded"){
                let date = new Date();
                date= date.toLocaleString();
                const record = { _id: charge.created,
                                date, 
                                charge: charge.id,
                                address,
                                email,
                                amount:charge.amount/100, 
                                name,
                                user: userId,
                                items
                                }
               const billed = await this.db.collection('billing').insertOne(record);
                if (billed) { 
                    //console.log(billed);
                    console.log("Inserted document in billing colection ");

                    const doc = await this.db.collection('cart').deleteOne({_id: userId});
                    if (!doc) { 
                        console.log(`failed to reset user ${userId} cart` );
                    } 
                }
            
                return new Promise((resolve, reject) => {
                        resolve(record);
                    });
            }  else {
                console.log(charge);
                return new Promise((resolve, reject) => {
                    reject(charge);
                    });
            } 
        } catch(error) {
            console.log(error);
			return new Promise((resolve, reject) => {
				reject(error);
				});
        }
    }


}

module.exports.BillingDAO = BillingDAO;