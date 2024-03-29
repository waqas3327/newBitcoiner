const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ClientSeller = new Schema({ 
    Username: String,
    Email: String,
    Password: String,
    Phone: Intl,
    //DOB:Date,
    Address: String,
    Currency:{
        BTC:Intl,
        ETC:Intl,
        Dollars:Intl
    }
   });

   module.exports = mongoose.model('clientseller',ClientSeller,'clientssellers');
