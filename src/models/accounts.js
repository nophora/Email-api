const mongoose = require('mongoose');



const inboxAccount = mongoose.Schema;

const inboxaccountSchema = new inboxAccount({
    image:String,
    user_name: String,
    user_lastname: String,
    user_email: String,
    user_password: String,
    date:String,
       
});


const account = mongoose.model('inboxaccount', inboxaccountSchema);



module.exports = account;
