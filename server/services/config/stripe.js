var configValues = require('./config');
const dotenv = require('dotenv');
dotenv.config();

var config = {
   stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
   stripeSecretKey: process.env.STRIPE_SECRET_KEY
   
}

module.exports.stripePublishableKey = config.stripePublishableKey;

module.exports.stripeSecretKey = config.stripeSecretKey; 