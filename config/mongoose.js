const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/authorization");
const db = mongoose.connection;

db.on('error',console.error.bind("error creating db"));

db.once('open',function(err){
    if(err){
        console.log('err opening db');
        return;
    }
});

module.exports = db;