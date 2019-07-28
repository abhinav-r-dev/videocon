const mongoose = require('mongoose')

//connect to mongodb
module.exports=mongoose.connect("mongodb://localhost/friday",{ useNewUrlParser: true },function(err){
    if(err){
        throw err;
    }
    else{
        console.log("App is connected to MongoDB Server");
    }
});