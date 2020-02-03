'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var userRoutes = require('./routes/user.route');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/v1', userRoutes);

/*
app.get('/prueba', (req, res)=>{
    res.status(200).send({message: 'Prueba correcta'});
})*/

module.exports = app;