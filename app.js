
const express = require('express');
const fs = require('fs');
const app = express();
var http = require('http');
var server = require('http').createServer(app); 
var ent = require('ent');



app.get('/', function (req, res) {
  res.sendfile(__dirname +'/index.html');
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});

io.sockets.on('connection', function (socket) {
        socket.emit('message', 'Vous êtes  connecté');

});

server.listen(8080);