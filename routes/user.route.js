'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');

var api = express.Router();

api.get('/pruebaControlador', userController.prueba);
api.post('/saveUser', userController.saveUser);
api.get('/listUsers', userController.listUsers);
api.get('/listUser/:id', userController.listUser);
api.put('/updateUser/:id', userController.updateUser);
api.delete('/deleteUser/:id', userController.deleteUser);

//URI's user-contact
api.put('/:id/setContact', userController.setContact);
api.put('/:idU/updateContact/:idC', userController.updateContact);
api.put('/:idU/removeContact/:idC', userController.removeContact);

module.exports = api;