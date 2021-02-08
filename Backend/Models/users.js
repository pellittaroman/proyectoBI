const { Schema , model } = require('mongoose');
//create Schema
const users =new Schema({
    id: {type: String || Number},
    name : {type: String},
    last_name: {type: String},
    age: {type: Number}
})

//export module
module.exports= model ('users',users); 