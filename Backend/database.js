const moongoose = require('mongoose');

//connect db
//se dejo direccion al descubierto pero solo en este ejemplo
moongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/persondb' , {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
    .then(db=>console.log('DB is connected'))
    .catch(err=> console.error(err));