var configValues = require('./config');
const dotenv = require('dotenv');
dotenv.config();

var config = {
   uname: process.env.MONGO_USERNAME,
   pwd: process.env.MONGO_PASSWORD
   
}

module.exports = {
    
    getDbConnectionString: function() {
        console.log(config.uname);
        return 'mongodb://' +config.uname +':'+ config.pwd +'@ds159235.mlab.com:59235/rp_shop';
    }
    
}