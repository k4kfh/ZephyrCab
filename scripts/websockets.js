//when you enable this, it logs all replies from the server to the console, except for the heartbeats which are just ignored
logallreplies = true

//do not change this
wsStatus = false

function connect(ip, port, automaticornot) {
    
    if (automaticornot != true) {
        //This is not being called automatically
        automaticornot = false;
    }
    
    
    ws = new WebSocket("ws://" + ip + ":" + port + "/json/")
    //when the connection opens,
    ws.onopen = function() {
        wsStatus = true
        ui.connection.status.set(true)
        console.log("Connection opened.")
        //start the heartbeats to keep it alive
        var heartbeatInterval = setInterval(heartbeats, 500)
        console.log("Beginning heartbeats.")
        setListeners()
        sendcmd('{"list":"roster"}')
        
        //Display the appropriate connection message
        if (automaticornot == true) {
            //If this connection attempt was automatic
            Materialize.toast("Connected automatically to ws://" + cfg.ip + ":" + cfg.port, 3000)
        }
        else {
            //If this connection attempt was not automatic
            Materialize.toast("Connected manually to ws://" + cfg.ip + ":" + cfg.port, 3000)
        }
    }
    
    ws.onmessage = function(event) {
        data = JSON.parse(event.data);
        if (cfg.logallmessages == true) {
            var stringified = JSON.stringify(data);
            console.log("RECIEVED : " + stringified)
        }
        processReply(data);
    }
    
    ws.onclose = function() {
        console.log("well crap...the websocket closed")
        Materialize.toast("<i class='material-icons left'>warning</i>Lost connection to JMRI! Please refresh the page and reconnect. <a class='btn-flat orange-text' onclick='location.reload(true)'>Reload</a>")
    }
    
}


//heartbeats function to keep connection alive
// this function does not loop on it's own
function heartbeats() {
    
    ws.send('{"type":"ping"}')
    console.log('SENT : {"type":"ping"}' )
    
    
}


//this takes in a server's message and sends it out to the correct parts of the program to be handled
function processReply(ev) {
    latestMsg = ev
    if (ev.type == "pong") {
        //just ignore these, I only have this IF in case I want to log these in a special way or something.
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
    else if (ev[0] != undefined) {
        if (ev[0].type = "rosterEntry") {
            jmri.roster.raw = ev
            jmri.roster.entries = jmri.roster.reformat(jmri.roster.raw) //rebuild the reformatted roster every time we get new roster data
        
            //Now that the roster has been edited, we need to update the UI for the train
            train.ui.setup();
            train.ui.update();
        }
    }
}


//this is the preferred way to send commands. Use it instead of ws.send, because it will alert your users when they are not connected to JMRI via websockets (saves you time and them headaches)
function sendcmd(command) {
    if (wsStatus == true) {
        ws.send(command)
        if (cfg.logallmessages == true) {
            console.log("SENT : " + command)
            return "Sent.";
        }
        
    }
    else {
        Materialize.toast("<i class='material-icons left'>error</i>You need to connect to JMRI first!", 4000)
        console.error("Tried to send something, but we're not connected yet.")
        return "Can't send!"
        
    }
}

//this runs the second the websockets connection is open, it sets up any listeners to constantly let LocoThrottle know when the state of something changes.
function setListeners() {
    sendcmd('{"type":"power","data":{}}')
}

/*
This function is what makes the auto connect feature work. It is at the bottom of index.html, so it runs when the page loads.

It looks at the cfg object to see if the variables we need are configured or not, and connects if they are set up.
*/
function attemptAutoconnect() {
    if(cfg.ip != undefined) {
        connect(cfg.ip, cfg.port, true); //the third argument tells the connect() that it's being called automatically
        document.getElementById("ip").value = cfg.ip;
        document.getElementById("port").value = cfg.port;
                    
        //These two lines go over to the trainsettings tab and scroll up to the top of the page.
        document.getElementById("tab_trainsettings").click();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    else if (cfg.ip == undefined) {
        console.log("Did not connect automatically; no settings found!")
        Materialize.toast("<i class='material-icons left'>info</i>Couldn't find any settings for auto-connection, please connect manually.")
                    
        //These two lines go over to the connection tab and scroll up to the top of the page.
        document.getElementById("tab_connection").click();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}

