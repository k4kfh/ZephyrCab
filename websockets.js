//when you enable this, it logs all replies from the server to the console, except for the heartbeats which are just ignored
logallreplies = true

//do not change this
wsStatus = false

function connect(ip, port) {
    ws = new WebSocket("ws://" + ip + ":" + port + "/json/")
    //when the connection opens,
    ws.onopen = function() {
        wsStatus = true
        document.getElementById("wsstatus").innerHTML = "WebSockets: CONNECTED"

        console.log("Connection opened.")
        //start the heartbeats to keep it alive
        var heartbeatInterval = setInterval(heartbeats, 1350)
        console.log("Beginning heartbeats.")
        setListeners()
        init("connect")
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
    
}


//heartbeats function to keep connection alive
// this function does not loop on it's own
function heartbeats() {
    
    ws.send('{"type":"ping"}')
    
    
}


//this takes in a server's message and sends it out to the correct parts of the program to be handled
function processReply(ev) {
    latestMsg = ev
    if (ev.type == "pong") {
        //just ignore these
    }
    else if (ev.type == "hello") {
        //sets up initial info about railroad
        JMRIhellomsg = ev
        layoutRailroadName = ev.data.railroad
    }
    else if (ev.type == "throttle") {
        //send to throttle info handler
        JSONhandleType_throttle(ev)
    }
    else if (ev.type == "sensor") {
        //send to sensor info handler
    }
    
    else if (ev.type == "turnout") {
        //send to turnout info handler
    }
    else if (ev.type == "power") {
        //send to layout power info handler
        JSONhandleType_power(ev)
    }
    else if (ev.list) {
        //send to list handler
    }
}


//this is the preferred way to send commands. Use it instead of ws.send, because it will alert your users when they are not connected to JMRI via websockets (saves you time and them headaches)
function sendcmd(command) {
    if (wsStatus == true) {
        ws.send(command)
        return "Sent."
        
    }
    else {
        alert("We can't tell JMRI whatever you just did, because your WebSockets connection is not up and running yet.")
        console.error("Tried to send something, but we're not connected yet.")
        return "Can't send!"
        
    }
}


//this is used for any command sent to a locomotive, since it provides an alert if we haven't requested a throttle yet.
function sendcmdLoco(command) {
    if (locoAddress != undefined) {
        return sendcmd(command)
    }
    else {
        alert("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P")
    }
}

//this function is used for sending any SPEED RELATED commands to a locomotive (handled only by ProtoEngine() ). It's what handles the reverser's weird hard-to-deal-with NEUTRAL setting
function sendcmdLocoSpeed(speed) {
    if(reverser != "neutral") {
        sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "throttle":"' + throttleName + '", "speed":' + speed + '}}')
    }
    else{
        console.log("Reverser is set to neutral, so we aren't sending the requested speed command to the engine.")
    }
    
    
}



function disconnnect() {
    if(wsStatus == true) {
        
        
    }
    else {
        alert("It's near impossible to disconnect when you're not connected in the first place...")
    }
}