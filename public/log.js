$(function() {
    spot=""
    if(window.location.hostname=="localhost"){
    socket = io("localhost:3000");
    }else{
    socket = io(window.location.hostname);
    }
    function print(mes){
        spot.innerHTML=spot.innerHTML+mes
    }
    socket.emit('jlog',)
    socket.on('jlog', data =>{
        document.querySelector('aside').innerHTML=JSON.stringify(data[1])
        spot=document.querySelector("main")
        for(i=0;i<data[0].length;i++){
            print(data[0][i])
        }
    })
    socket.on('nlog', data =>{
        print(data)
    })
    socket.on('players',data=>{
        document.querySelector('aside').innerHTML=JSON.stringify(data)
    })
  })