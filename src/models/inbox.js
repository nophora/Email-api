const mongoose = require('mongoose');



const Inbox = mongoose.Schema;

const inboxSchema = new Inbox({
    user: [Object],
    email: String,
    inbox: [Object],
    sent: [Object],
    unsent: [Object],
    deleted_emails:[Object],
    labels: [Object],
    roles:Array,
    date: {
        type: String,
        default:Date.now()
    },
});


const account = mongoose.model('inbox',inboxSchema);



module.exports = account;







