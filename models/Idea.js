//no SQL is a schemaless datatabse, it does not require us to make a schema at the db level, but we need to define one
//on application level using mongoose

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//create schema
const IdeaSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});
mongoose.model('ideas', IdeaSchema) //the collection name is ideas and it is connected to the 
//ideachema
