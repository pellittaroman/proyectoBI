//entorno
if(process.env.NODE_ENV =="development"){
    require('dotenv').config();
}


const express = require('express');
const morgan = require('morgan');
const { patch } = require('./Routes/Proyect');
const path= require('path');
//Initializations

const app = express();
require('./database');

//Settings

app.set('port', process.env.PORT || 8001);

//Middlewares

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Routes

app.use(require('./Routes/Proyect'));

//Star server

app.listen(app.get('port'), ()=>{ console.log('Server on port', app.get('port'))});