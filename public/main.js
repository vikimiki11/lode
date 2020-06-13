$(function() {
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $inputMessage = $('.global'); // Input message input box
  var $main = $("main");
  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var $inputgame = $('.local')
  var $game = $('.hra')
  var coplayer
  // Prompt for setting a username
  var username;
  var connected = false;
  var $currentInput = $usernameInput.focus();
  if(window.location.hostname=="localhost"){
  socket = io("localhost:3000");
  }else{
  socket = io(window.location.hostname);
  }
  if (localStorage.getItem('name')) {
    document.querySelector(".usernameInput").value=localStorage.getItem('name');
  }
  const addParticipantsMessage = (data) => {
    var message = '';
    if (data.numUsers === 1) {
      message += "Jsi tu sám";
    } else {
      message += "Máš tu " + (data.numUsers-1) + " kamarády";
    }
    log(message);
  }
  const setUsername = () => {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {

      // Tell the server your username
      socket.emit('add user', username);
      localStorage.setItem('name', username);
      console.log(socket)
    }
  }

  // Sends a chat message
  const sendMessage = () => {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }
  const sendGameMessage = () => {
    var message = $inputgame.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputgame.val('');
      addGameChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('game message', {
        username: username,
        message: message
      });console.log({
        username: username,
        message: message
      })
    }
  }

  // Log a message
  const log = (message) => {
    document.querySelector(".glob").innerHTML+='<p class="log" style="display: block;">'+message+'</p>'
  }
  const gameLog = (message) => {
    document.querySelector(".localchat").innerHTML+='<p class="log" style="display: block;">'+message+'</p>'
  }

  // Adds the visual chat message to the message list
  const addChatMessage = (data) => {
    document.querySelector(".glob").innerHTML+='<p class="message" style="display: block;"><span class="username" style="color: '+getUsernameColor(data.username)+';">'+data.username+'</span><span class="messageBody">'+data.message+'</span></p>'
  }
  const addGameChatMessage = (data) => {
    console.log(data)
    document.querySelector(".localchat").innerHTML+='<p class="message" style="display: block;"><span class="username" style="color: '+getUsernameColor(data.username)+';">'+data.username+'</span><span class="messageBody">'+data.message+'</span></p>'
  }


  // Prevents input from having injected markup
  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }


  // Gets the color of a username through our hash function
  const getUsernameColor = (username) => {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(event => {
    if (event.which === 13 && !username) {
        $currentInput.focus();
        setUsername();
    }
  });


  $inputMessage.keydown(event => {
    if (event.which === 13) {
      sendMessage()
    }
  });

  $inputgame.keydown(event => {
    if (event.which === 13) {
      sendGameMessage()
    }
  });

  // socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', (data) => {
    connected = true;
    // Display the welcome message
    var message = "Chat pro hráče lodí:";
    log(message);
    addParticipantsMessage(data);
    $loginPage.fadeOut();
    $chatPage.show();
    $main.show();
    $loginPage.off('click');
    $currentInput = $inputMessage.focus();
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  socket.on('reconnect', () => {
    log('Připojení bylo obnoveno');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', () => {
    log('Pokus o znovupřipojení se nezdařil');
  });
  socket.on('denied',() =>{
    alert("již použité jméno")
    location.reload();
  })
  socket.on('game chat', (data) => {
    addGameChatMessage(data);
  });
  socket.on('in room', (coplayername) => {
    coplayer=coplayername
    gameLog("Začal jsi hru s: "+coplayer)
    //idiooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooot
  });
  socket.on('out room', () => {
    coplayer=""
    //idiooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooot
  })
  socket.on('in queue', () => {
    //idiooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooot
  })
  socket.on('waiting for accept', () => {
    //idiooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooot
  })
  function ping(){
    let d = new Date();
    let n = d.getTime();
    socket.emit('pingpongball',(n))
  }
  socket.on('pingpongball',(data)=>{
    let d = new Date();
    let n = d.getTime();
    console.log(n)
    console.log(data[0])
    console.log(data[1])
    console.log(n-data[0])
    console.log(n-data[1])
  })
});