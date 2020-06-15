$(function() {
    var connected = false;
    spot=""
    if(window.location.hostname=="localhost"){
    socket = io("localhost:3000");
    }else{
    socket = io(window.location.hostname);
    }
    function print(mes){
        if(typeof mes=="object"){
            for(i in mes){
                if(typeof mes[i]=="object"){
                    print(mes[i])
                }else{
                    spot.innerHTML=spot.innerHTML+"<p>"+mes[i]+"</p>"
                }
            }
        }else{
            spot.innerHTML=spot.innerHTML+"<p>"+mes+"</p>"
        }

    }
    socket.emit('jlog',)
    socket.on('jlog', data =>{
        spot=document.querySelector("main")
        for(i=0;i<data.length;i++){
            print(data[i])
        }
    })
    socket.on('nlog', data =>{
        print(data)
    })
  })