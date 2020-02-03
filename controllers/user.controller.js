'use strict'

var User = require('../models/user.model');
var Contact = require('../models/contact.model');

function prueba(req, res){
    console.log(req);
    res.status(200).send({message: 'Ruta de prueba desde el controlador'});
}

function saveUser(req,res){
    var user = User();
    var params = req.body;

    if( params.name &&
        params.lastname && 
        params.email && 
        params.password &&
        params.phone){

        User.findOne({email: params.email}, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(userFind){
                res.status(200).send({message: 'Correo ya utilizado'});
            }else{
                user.name = params.name;
                user.lastname = params.lastname;
                user.email = params.email;
                user.password = params.password;
                user.phone = params.phone;

                user.save((err, userSaved)=>{
                    if(err){
                        res.status(500).send({message:'Error general'});
                    }else{
                        if(userSaved){
                            res.status(200).send({user: userSaved});
                        }else{
                            res.status(200).send({message: 'Error al guardar el usuario'});
                        }
                    }
                });

            }
        });

            
    }else{
        res.status(200).send({message: 'Por favor ingrese todos los datos'});
    }


}

function listUsers(req, res){
    User.find({}).exec((err, users)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(users){
                res.status(200).send({todoLosUsuarios: users});
            }else{
                res.status(200).send({message: 'No se obtuvieron datos'});
            }
        }
    })
}

function listUser(req, res){
    var userId = req.params.id;

    User.findById(userId).exec((err, user)=>{
        if(err){
            res.status(500).send({message: 'Error en servidor'});
        }else{
            if(user){
                res.status(200).send({user: user});
            }else{
                res.status(200).send({message: 'No hay registros'});
            }
        }
    });
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, update, {new: true},(err, userUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(userUpdated){
                res.status(200).send({usuarioAcutalizado: userUpdated});
            }else{
                res.status(200).send({message: 'Error al actualizar'});
            }
        }
    })

}

function deleteUser(req, res){
    var userId = req.params.id;

    User.findByIdAndRemove(userId, (err, userDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error general}'});
        }else if(userDeleted){
            res.status(200).send({message: 'Usuario eliminado', userDeleted});
        }else{
            res.status(404).send({message: 'Error al eliminar'});
        }
    });
}

function setContact(req, res){
    let userId = req.params.id;
    let params = req.body;
    let contact = new Contact();

    if(params.name && params.phone){

    User.findById(userId, (err, userFind)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(userFind){
            contact.name = params.name;
            contact.lastname = params.lastname;
            contact.phone = params.phone;

            User.findByIdAndUpdate(userId, {$push: {contacts: contact}},{new:true}, (err, userUpdated)=>{
                if(err){
                    res.status(500).send({message:'Error general'});
                }else if(userUpdated){
                    res.status(200).send({userUpdated: userUpdated});
                }else{
                    res.status(418).send({message: 'Error al actualizar'});
                }
            });
        }else{
            res.status(418).send({message: 'Usuario no encontrado'});
        }
    });
        
    }else{
        res.status(200).send({message: 'Faltan datos'});
    }
}

function updateContact(req, res){
    const userId = req.params.idU;
    var contactId = req.params.idC;
    var params = req.body;

    User.findById(userId, (err, userOk)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(userOk){
            User.findOneAndUpdate({_id:userId, "contacts._id":contactId}, 
            {"contacts.$.name": params.name,
            "contacts.$.lastname": params.lastname,
            "contacts.$.phone": params.phone},{new:true}, (err, userUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(userUpdated){
                    res.send({user: userUpdated});
                }else{
                    res.status(418).send({message: 'No se actualizó el contacto'});
                }
            }
            );
        }else{
            res.status(418).send({message: 'No existe el usuario'});
        }
    });
}

function removeContact(req, res){
    let userId = req.params.idU;
    let contactId = req.params.idC;

    User.findOneAndUpdate({_id:userId, "contacts._id":contactId}, 
    {$pull:{contacts:{_id:contactId}}}, {new:true}, 
    (err, contactRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(contactRemoved){
            res.send({user: contactRemoved});
        }else{
            res.status(418).send({message: 'Contacto no eliminado'});
        }
    });

}



module.exports = {
    prueba,
    saveUser,
    listUsers,
    listUser,
    updateUser,
    deleteUser,
    setContact,
    updateContact,
    removeContact
}