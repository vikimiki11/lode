// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;
var members = []
io.on('connection', (socket) => {
  var addedUser = false;
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if(members.indexOf(username)==-1){
      members[members.length]=username
      if (addedUser) return;

      // we store the username in the socket session for this client
      socket.username = username;
      console.log(socket.username)
      console.log(members)
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers
      });
    }else{socket.emit('denied',(true))}
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
    }
    try{
      delete members[members.indexOf(socket.username)]
    }
    catch(err){
      console.log(err)
    }
    console.log(members)
  });

  socket.on('game message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('game chat', data);
    console.log(data)
  });
  socket.on('game messages', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('game chat', data);
    console.log(data)
  });
});