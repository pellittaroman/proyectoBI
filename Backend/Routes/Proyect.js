const {Router} = require('express');
const { Error } = require('mongoose');
const router =  Router();

//models
const User= require('../Models/users');
const Persons = require('../Models/persons');
//routes

//ruta post permite cargar nuevos usuario a coleccion con el formato pedido.
//en caso de error envia un mensaje con el error.
router.post("/users", async (req, res)=>{
try {
        const newPerson=userNew(req.body);
        await newPerson.save();
        res.json({'message': 'new user saved'});
    } catch (error) {
        res.send(error.message);
    }
})

//ruta get sin id(legajo) devuelve todos los usuario con el formato solicita.
//si se carga id devuelve el usuario con ese id, si el id es incorrecto envia un json con el mensaje del error.
//si no se usa el id la funcion permite cargar en el body limit y offset.
router.get("/users/:id?",async (req,res)=>{
    
    if(req.params.id==undefined){
        const limits=req.body.limit;
        let flagL=req.body.limit;
        let flagL1=req.body.limit;
        let flagO=req.body.offset;
        const offsets=req.body.offset;
        if(flagL==undefined && flagO==undefined){
            const aux= await Persons.find(); 
            let restore=userSearch(aux);
            res.json(restore);
        
        }
        else{
            
            if(flagL=!undefined && flagO==undefined){
                let limit=limits;
                let aux= await Persons.find().limit(limit);
                let user= userSearch(aux);
                res.json(user);
            }
            else{
                    if(flagL1===undefined ){
                    
                        let offset=offsets;
                        let aux= await Persons.find().skip(offset);
                        let back=userSearch(aux);
                        res.json(back);
                    }
                    else
                    {
                        let offset=offsets;
                        let limit= limits;
                        let aux= await Persons.find().limit(limit).skip(offset);
                        let back=userSearch(aux);
                        res.json(back);
                    }
            }
        } 
     
        
    }
    else
    {
        let user=await Persons.find();
        let ok=userFind(req.params.id,user);
        if(ok===false){
            res.json({'message':'user unknown'});
        }
        else{
            let index=ok;
            const aux= await Persons.findById(index);
            let user=userView(aux);
            res.json(user);
        }  
        
    }
})
//recibe el id(legajo) del usuario a modificar
//verifica si existe el legajo
//se trae al usuario entero, se puede modificar todos los campos visibles o solo algunos
router.put("/users/:id",async (req,res)=>{
    try {
        let user=await Persons.find();
        let ok=userFind(req.params.id,user);
        
        if(ok===false){
            res.json({'message':'user unknown'});
        }
        else
        {
            let index=ok;
            let oldUser=await Persons.findById(index);
            let user=updateUser(req.body,oldUser);
            await Persons.findByIdAndUpdate(index,user);
            res.json({'message':'user updated'});
        }
        
    } catch (error) {
        res.send(error);
    }
        
})

//ruta delete toma id(legajo) lo busca de existir lo elimina de la colecccion.
//de no encontrarlo avisa con json con un mensaje

router.delete("/users/:id",async (req,res)=>{
    try {
        let user=await Persons.find();
        let ok=userFind(req.params.id,user);
        
        if(ok===false){
            res.json({'message':'user unknown'});
        }
        else
        {
            let index=ok;
            await Persons.findByIdAndDelete(index);
            res.json({'message':'user deleted'});
        }
        
    } catch (error) {
        res.send(error);
    }
})

//se encarga de traer un array de Json y lo pasa a otra funcion
//de vuelve un Array con Json ordenados de acuerdo a lo solicitado
function userSearch(aux){
    let restore=[];
    let num=0;
    aux.forEach(a=>{
                    let user=userView(a);
                    restore[num]=user;
                    num=num+1;
    });
    return restore;
}

//se le pasa un Json con los dato del usuario, se encarga de transformar y ordenar de acuerdo a lo solicitado
function userView(aux){
    const id=aux.legajo;
        const name=aux.name;
        const last_name=aux.last_name;
        let aux1=new Date(aux.birthday);
            if(new Date().getMonth()>= aux1.getMonth())
            {
                if(new Date().getDay()>=aux1.getDay())
                {
                    age=new Date().getFullYear()-aux1.getFullYear();
                }
            }
            else
            {
                age=new Date().getFullYear()-aux1.getFullYear()-1;
            }
        let user={id,name,last_name,age}; 
        return user;    

}

// se le pasa el body, toma los datos y crea el nuevo usuario
function userNew(aux){
        const {name, last_name, legajo, email}= aux;
        const bday=aux.birthday;
        const a=bday.split("/");
        const age=a[2];
        const month=a[1]-1;
        const day=a[0];
        const birthday= new Date(age,month,day);
        const newPerson= new Persons({name,last_name, legajo, email, birthday});
        return newPerson;
}
//recibe el id(legajo) y la lista de usuarios, si no encuentra el id devuelve false.
//si lo encuentra devuelve el id para poder operar con el db
function userFind(aux,user){
    let back=false;
    user.forEach(a=>{
        
        if(a.legajo==aux)
        {
            back= a.id;
        }

    })
    return back; 
} 

//recibe los datos del body(los cuales se quiere cambiar) y el usuario tal cual esta en la base
//Cambia todos los valores que recibe y mande el usuario de la base con los pertimentes cambios para poder ser actualizado 
function updateUser(up,old){
    if(up.id!=undefined)
    {
        old.legajo=up.id;
    }
    if(up.name!=undefined)
    {
        old.name=up.name;
    }
    if(up.last_name!=undefined)
    {
        old.last_name=up.last_name;
    }
    if(up.email!=undefined)
    {
        old.email=up.email;
    }
    if(up.birthday!=undefined)
    {
        old.birthday=up.birthday;
    }
    
    return old;

}

//export module
module.exports = router;