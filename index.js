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
var membersact={}
var queue=[]
var queueid=[]
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
      membersact.username={}
      membersact.username.active=0
      membersact.username.rival=""
      membersact.username.room=""
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
      membersact.username.active=0
      membersact.username.rival=""
      membersact.username.room=""
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
  });
  socket.on('send invite', (data) => {
    console.log(data)
  });
  socket.on('quickgame', () => {
    if(queue.length==0){
      socket.emit('in queue')
      queue[queue.length]=socket.username
      queueid[username]=socket.id
    }else{
      
    }
  });
  socket.on('pingpongball',(data)=>{
    let d = new Date();
    let n = d.getTime();
    socket.emit('pingpongball',([data,n]))
  })
});