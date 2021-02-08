const { Schema , model } = require('mongoose');

//create Schema
const persons =new Schema({
    name : {type: String, required: true},
    last_name: {type: String, required: true},
    legajo: {type: String, required: true, uniqued: true},
    email: {type: String, required: true},
    birthday: {type: Date,required: true}
})

//export module 
module.exports= model ('persons',persons); 