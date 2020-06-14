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
var userid=[]
var lobbyid=0
io.on('connection', (socket) => {
  var addedUser = false;
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    console.log("OD: "+socket.username+" Do: Global Co: "+data);
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if(members.indexOf(username)==-1){
      members[members.length]=username
      console.log("připojil se: "+username)
      membersact[username]={}
      membersact[username].active=0
      membersact[username].rival=""
      membersact[username].room=""
      membersact[username].id=socket.id
      if (addedUser) return;

      // we store the username in the socket session for this client
      socket.username = username;
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
      let username=socket.username
      membersact[username].active=false
      membersact[username].rival=""
      membersact[username].room=""
      members=members.filter(function (el) {
        return el != socket.username;
      });
      queue=queue.filter(function (el) {
        return el != socket.username;
      });
      console.log("čekárna"+queue);
      console.log("memeber act");
      console.log(membersact);
      
    }
    catch(err){
      console.log(err)
      console.log("čekárna"+queue);
      console.log("memeber act");
      console.log(membersact);
    }
    console.log(members)
  });

  socket.on('game message', (data) => {
    // we tell the client to execute 'new message'
    console.log("OD: "+socket.username+" Do: "+membersact[socket.username].room+" Co: "+data.message);
    socket.broadcast.to(membersact[socket.username].room).emit('game chat', data);
  });
  socket.on('fire', (data) => {
    // we tell the client to execute 'new message'
    console.log("tah OD: "+socket.username+" Do: "+membersact[socket.username].room+" Co: "+data);
    socket.broadcast.to(membersact[socket.username].room).emit('cover', data);
  });
  socket.on('ready', (data) => {
    // we tell the client to execute 'new message'
    console.log("tah OD: "+socket.username+" Do: "+membersact[socket.username].room+" Co: ready");
    socket.broadcast.to(membersact[socket.username].room).emit('prepared', data);
  });
  socket.on('send invite', (data) => {
    console.log(data)
  });
  socket.on('quickgame', () => {
    if(queue.length==0){
      socket.emit('in queue')
      queue[queue.length]=socket.username
    }else{
      user1=socket.username
      user2=queue[0]
      socket.emit('in room',user2)
      socket.join(lobbyid)
      socket.to(membersact[queue[0]].id).emit("jj",[lobbyid,user1])
      membersact[user1].active=true
      membersact[user1].rival=user2
      membersact[user1].room=lobbyid
      membersact[user2].active=true
      membersact[user2].rival=user1
      membersact[user2].room=lobbyid
      lobbyid++
      queue=queue.filter(function (el) {
        return el != queue[0];});
    }
    console.log("čekárna"+queue);
  });
  socket.on('jj', (data) => {
      socket.join(data[0])
      socket.emit('in room',data[1])
  });
  socket.on('pingpongball',(data)=>{
    let d = new Date();
    let n = d.getTime();
    socket.emit('pingpongball',([data,n]))
  })
});