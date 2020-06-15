$(function() {
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  clickcare=false
  rivaldata=[]
  var cascomitu=999999999999999
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
  function game(sekce){
    if(sekce){
      merge(rivaldata,myfarr,false)
      clickcare=true
    }else{
      merge(aktlode,enfarr,true)
    }
  }
  function merge(larr,sarr,my){
    lmat=lodetometrix(larr)
    toprint=[]
    for(i=0;i<sarr.length;i++){
      if(lmat[sarr[i][1]][sarr[i][0]]=="voda"){
        lmat[sarr[i][1]][sarr[i][0]]="miss"
      }else{
        lmat[sarr[i][1]][sarr[i][0]]="bum"
      }
    }
    anyf=true
    for(i=0;i<larr.length;i++){
      finded=false
      for(x=0;x<lmat.length;x++){
        for(y=0;y<lmat[x].length;y++){
          if(lmat[x][y]==i.toString()){
            finded=true
            anyf=false
          }
        }
      }
      if(!finded || my){
        toprint[toprint.length]=larr[i]
      }
    }
    for(i=0;i<sarr.length;i++){
      if(lmat[sarr[i][1]][sarr[i][0]]=="miss"){
        toprint[toprint.length]={
        w:1,
        h:1,
        souradnice:[[sarr[i][1],sarr[i][0]]],
        src:"kapka",
        otoceni:0,
        l:false
        }
      }else{
        toprint[toprint.length]={
          w:1,
          h:1,
          souradnice:[[sarr[i][1],sarr[i][0]]],
          src:"X",
          otoceni:0,
          l:false
        }
      }
      
    }
    printlodi(toprint)
    return anyf
  }
  //print lodí do tabulky
    function printlodi(arr){
      document.querySelector("#lode").innerHTML=""
      for(var i=0;i<arr.length;i++){
        console.log(i)
        console.log(arr)
        miny=9999999
        minx=9999999
        for(let y=0;y<arr[i].souradnice.length;y++){
          if(arr[i].souradnice[y][0]<minx){
            minx=arr[i].souradnice[y][0]
          }
          if(arr[i].souradnice[y][1]<miny){
            miny=arr[i].souradnice[y][1]
          }
          console.log(minx)
          console.log(miny)
          console.log(arr[i].souradnice[y][1])
          console.log(arr[i].souradnice[y][0])
        }
        if(Math.abs(arr[i].otoceni)%2==1){
          miny=miny-((arr[i].h-1)/2)+((arr[i].w-1)/2)
          minx=minx+((arr[i].h-1)/2)-((arr[i].w-1)/2)
        }
        if(build){
        document.querySelector("#lode").innerHTML=document.querySelector("#lode").innerHTML+"<img style='image-rendering: pixelated;position: absolute;left:"+minx+"em;top:"+miny+"em;height:"+arr[i].h+"em;width:"+arr[i].w+"em;transform:rotateZ("+arr[i].otoceni*90+"deg);' src='img/"+arr[i].src+".png' draggable='true' id='"+i+"'>"
        }else{
          if(arr[i].l){
            document.querySelector("#lode").innerHTML=document.querySelector("#lode").innerHTML+"<img style='image-rendering: pixelated;position: absolute;left:"+minx+"em;top:"+miny+"em;height:"+arr[i].h+"em;width:"+arr[i].w+"em;transform:rotateZ("+arr[i].otoceni*90+"deg);pointer-events: none;' src='img/"+arr[i].src+".png' id='"+i+"'>"
          }else{
            document.querySelector("#lode").innerHTML=document.querySelector("#lode").innerHTML+"<img style='image-rendering: pixelated;position: absolute;left:"+minx+"em;top:"+miny+"em;height:"+arr[i].h+"em;width:"+arr[i].w+"em;transform:rotateZ("+arr[i].otoceni*90+"deg);' src='img/"+arr[i].src+".png' id='"+i+"'>"
          }
        }
      }
      if(build){
        document.querySelectorAll('img').forEach(item => {
          item.addEventListener('dragstart', event => {
            console.log("startdrag"+event.clientX+" "+event.clientY );
            x=event.clientX
            y=event.clientY
          })
          item.addEventListener('dragend', event => {
            cr=document.querySelectorAll("table :nth-child(2) :nth-child(2)")[0]
            console.log("enddrag"+event.clientX+" "+event.clientY );
            console.log(event);
            jumpx=Math.round((event.clientX-x)/cr.offsetHeight)
            jumpy=Math.round((event.clientY-y)/cr.offsetHeight)
            id=event.target.id
            for(let y=0;y<arr[id].souradnice.length;y++){
              arr[id].souradnice[y][0]=arr[id].souradnice[y][0]+jumpx
              arr[id].souradnice[y][1]=arr[id].souradnice[y][1]+jumpy
            }
            printlodi(aktlode)
          })
          item.addEventListener('click', event => {
            id=event.target.id
            miny=9999999
            minx=9999999
            maxy=-9999999
            maxx=-9999999
            newpole=[]
            for(let y=0;y<arr[id].souradnice.length;y++){
              if(arr[id].souradnice[y][0]<minx){
                minx=arr[id].souradnice[y][0]
              }
              if(arr[id].souradnice[y][1]<miny){
                miny=arr[id].souradnice[y][1]
              }
              if(arr[id].souradnice[y][0]>maxx){
                maxx=arr[id].souradnice[y][0]
              }
              if(arr[id].souradnice[y][1]>maxy){
                maxy=arr[id].souradnice[y][1]
              }
            }
            dx=maxx-minx
            dy=maxy-miny
            for(let y=0;y<arr[id].souradnice.length;y++){
              newpole[y]=[]
              newpole[y][1]=arr[id].souradnice[y][0]-minx+miny
              newpole[y][0]=(((miny+maxy)/2-arr[id].souradnice[y][1])+(minx+dy/2))
            }
            arr[id].souradnice=newpole
            arr[id].otoceni++
            printlodi(aktlode)
          })
        })
      }
    }
    function lodetometrix(arr){
      pole=[]
      for(var i=0;i<(document.querySelectorAll("table.centr tr td").length/document.querySelectorAll("table.centr tr").length);i++){
        pole[i]=[]
        for(let d=0;d<document.querySelectorAll("table.centr tr").length;d++){
          pole[i][d]="voda"
      }
    }
      for(var i=0;i<arr.length;i++){
        for(let d=0;d<arr[i].souradnice.length;d++){
          if(!(arr[i].souradnice[d][0]<0 || arr[i].souradnice[d][1]<0 || arr[i].souradnice[d][0]>(document.querySelectorAll("table.centr tr td").length/document.querySelectorAll("table.centr tr").length-1) || arr[i].souradnice[d][1]>(document.querySelectorAll("table.centr tr").length-1))){
            if(pole[arr[i].souradnice[d][0]][arr[i].souradnice[d][1]]=="voda"){
              pole[arr[i].souradnice[d][0]][arr[i].souradnice[d][1]]=i
            }else{
              return false
            }
          }else{
            return false
          }
        }
      }
      return pole
    }
    function checkfortouch(arr){
      for(i=0;i<arr.length;i++){
        for(y=0;y<arr[i].length;y++){
          if(arr[y][i]!="voda"){
            console.log("x: "+y+" y: "+i+" = "+arr[y][i])
            s=arr[y][i]
            a=rwe(arr[y+1],i)
            b=rwe(arr[y+1],i+1)
            c=rwe(arr[y],i+1)
            d=rwe(arr[y-1],i+1)
            viki=[1]
            if(!(a=="voda" || a==s || (typeof a)=="undefined")){
              return [arr[y][i],a]
            }
            if(!(b=="voda" || b==s || (typeof b)=="undefined")){
              return [arr[y][i],b]
            }
            if(!(c=="voda" || c==s || (typeof c)=="undefined")){
              return [arr[y][i],c]
            }
            if(!(d=="voda" || d==s || (typeof d)=="undefined")){
              return [arr[y][i],d]
            }
          }
        }
      }
      return false
    }
    function rwe(padum,id){
      try{
        return padum[id]
      }
      catch{
        return "voda"
      }
    }
    startlode=[
      {
        w:1,
        h:1,
        souradnice:[[0,-1]],
        src:"kostka",
        otoceni:0,
        l:true
      },
      {
        w:2,
        h:2,
        souradnice:[[-2,0],[-1,0],[-2,1],[-1,1]],
        src:"Kkostka",
        otoceni:0,
        l:true
      },
      {
        w:5,
        h:2,
        souradnice:[[2,-1],[3,-1],[4,-1],[5,-1],[6,-1],[5,-2],[3,-2]],
        src:"parnik",
        otoceni:0,
        l:true
      },
      {
        w:3,
        h:2,
        souradnice:[[8,-1],[9,-1],[10,-1],[9,-2]],
        src:"tetris",
        otoceni:0,
        l:true
      }
      ,
      {
        w:4,
        h:1,
        souradnice:[[-1,3],[-1,4],[-1,5],[-1,6]],
        src:"runway",
        otoceni:1,
        l:true
      }
    ]
    aktlode=startlode
    console.log(lodetometrix(aktlode))
    
  // Keyboard and mouse events

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
  quckread=true
  document.querySelector("#Quckgame").addEventListener("click", ()=>{
    if(quckread || window.location.hostname=="localhost"){
      socket.emit('quickgame',)
      quckread=false
      setTimeout(function(){quckread=true},1000)
    }
  });
  document.querySelector("#kontrola").addEventListener("click", ()=>{
    if(lodetometrix(aktlode)){
      if(!(checkfortouch(lodetometrix(aktlode)))){
        malert("Máš to správně sestavené")
        $("#kontrola").hide()
        let d = new Date();
        cascomitu = d.getTime();
        ichprepare=true
        build=false
        printlodi(aktlode)
        socket.emit('ready',[aktlode,cascomitu])
        if(derprepare){
          malert("Hra začala")
          if(rivalcas<cascomitu){
            game(true)
          }else{
            game(false)
          }
        }
      }else{
        v=checkfortouch(lodetometrix(aktlode))
        document.getElementById(v[0].toString()).style.backgroundColor = "red";
        document.getElementById(v[1].toString()).style.backgroundColor = "red";
        malert("Lodě se nesmí dotýkat. Ani rohy se nesmí dotýkat.")
      }
    }else{
      malert("Některé lodě se ti překrývají a nebo jsou mimo pole.")
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
    $game.show()
    build=true
    printlodi(aktlode)
    $("#kontrola").show()
    $('.priprava').hide()
    ichprepare=false
    derprepare=false
    enfarr=[]
    myfarr=[]
    //idiooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooot
  });
  socket.on('out room', () => {
    coplayer=""
    //idiooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooot
  })
  socket.on('in queue', () => {
    //idiooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooot
    malert("Jsi v pořadí počkej.")
    if(window.location.hostname!="localhost"){
      $('.priprava').hide()
    }
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
    console.log("Ping mezi serverem a clientem: "+((n-data[0])/2))
    console.log("Posunutí času ku serveru: "+(n-data[1]-((n-data[0])/2)))
  })
  socket.on('jj',(data)=>{
    socket.emit('jj',(data))
  })
  socket.on('cover',(data)=>{
    enfarr[enfarr.length]=data
    win=merge(aktlode,enfarr,true)
    if(win){
      malert("YOU FUCKING DONKEY")
    }
    setTimeout(function(){game(true)},5000)
  })
  socket.on('prepared',(data)=>{
    rivaldata=data[0]
    rivalcas=data[1]
    derprepare=true
    if(ichprepare){
      malert("Hra začala")
      if(rivalcas<cascomitu){
        game(true)
      }else{
        game(false)
      }
    }
  })
  //intervaly pro jakékoly účely
  opal=0
  setInterval(function(){ping()},10000)
  setInterval(function(){opal=opal*0.96;document.querySelector(".alert").style.opacity=opal},100)
  function malert(mes){document.querySelector(".alert").innerHTML=mes;opal=1}
  document.querySelectorAll("table.centr td").forEach(item => {
    item.addEventListener('click', event => {
      if(clickcare){
        myfarr[myfarr.length]=item.id.split("bunka")[1]
        socket.emit("fire",item.id.split("bunka")[1])
        win=merge(rivaldata,myfarr,false)
        if(win){
          malert("easy Win lol")
        }
        setTimeout(function(){game(false)},5000)
        clickcare=false
      }
    })
  })
})