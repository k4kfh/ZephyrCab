//when you enable this, it logs all replies from the server to the console, except for the heartbeats which are just ignored
logallreplies = true

//do not change this
wsStatus = false

function connect(ip, port) {
    ws = new WebSocket("ws://" + ip + ":" + port + "/json/")
    //when the connection opens,
    ws.onopen = function() {
        wsStatus = true

        console.log("Connection opened.")
        //start the heartbeats to keep it alive
        var heartbeatInterval = setInterval(heartbeats, 500)
        console.log("Beginning heartbeats.")
        setListeners()
        init("connect")
        sendcmd('{"list":"roster"}')
    }
    
    ws.onmessage = function(event) {
        data = JSON.parse(event.data);
        if (logallreplies == true) {
            if (data.type == "pong") {
            }
            else{
                console.dir(data)
                processReply(data)
            }
        }
        else {
        }
    }
    
    ws.onclose = function(event) {
        data = JSON.parse(event.data);
        console.log("WEBSOCKET CLOSED!")
        console.dir(data)
    }
    
}


//heartbeats function to keep connection alive
// this function does not loop on it's own
function heartbeats() {
    
    ws.send('{"type":"ping"}')
    //console.log("Sent hb")
    
    
}


//this takes in a server's message and sends it out to the correct parts of the program to be handled
function processReply(ev) {
    latestMsg = ev
    if (ev.type == "pong") {
        //just ignore these
        console.log("Recieved hb")
    }
    else if (ev.type == "hello") {
        //sets up initial info about railroad
        jmri.hellomsg = ev
        jmri.railroadName = ev.data.railroad
    }
    else if (ev.type == "throttle") {
        //send to throttle info handler
        //TODO, if we even need this with how complex this is and how un-normal it is compared to traditional DCC
    }
    else if (ev.type == "sensor") {
        //send to sensor info handler
    }
    
    else if (ev.type == "turnout") {
        //send to turnout info handler
    }
    else if (ev.type == "power") {
        //send to layout power info handler
        jmri.handleType.power(ev)
    }
    else if (ev.list) {
        //send to list handler
    }
    else if (ev[0].type = "rosterEntry") {
        jmri.roster.raw = ev
        jmri.roster.entries = jmri.roster.reformat(jmri.roster.raw) //rebuild the reformatted roster every time we get new roster data
    }
}


//this is the preferred way to send commands. Use it instead of ws.send, because it will alert your users when they are not connected to JMRI via websockets (saves you time and them headaches)
function sendcmd(command) {
    if (wsStatus == true) {
        ws.send(command)
        return "Sent."
        
    }
    else {
        Materialize.toast("We can't tell JMRI whatever you just did, because your WebSockets connection is not up and running yet.", 4000)
        console.error("Tried to send something, but we're not connected yet.")
        return "Can't send!"
        
    }
}

