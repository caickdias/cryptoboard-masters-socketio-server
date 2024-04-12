const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

//config
server.listen(process.env.PORT || 8002, () => {
    console.log(`[ server.js ] Listening on port ${server.address().port}`);
});

const users = {};
// socket events

io.on('connection', (client) => {
    console.log(`[ server.js ] ${(client.id)} connected`);    

    users[client.id] = { name: 'anonymous', id: client.id };

    client.on("username", username => {
      const user = {
        name: username || 'anonymous',
      };
      users[client.id] = user;

      io.emit('numberOfOnlineUsers', Object.keys(users).length);
    });

    client.on('message', (message) => {      
        io.emit('message', { username: users[client.id].name, message: message, id: client.id });
    });    

    client.on("disconnect", () => {
      delete users[client.id];
      io.emit('numberOfOnlineUsers', Object.keys(users).length);    
      io.emit("disconnected", client.id);
    })

});

