link = {
    status : false,
    latestMessage: "",
    logTimestamp : function(type) {
         if (type == undefined) {
             type = 24;
         }
        if (type == 24) {
            var currentDate = new Date();
            var hours = currentDate.getHours();
            var minutes = currentDate.getMinutes();
            var seconds = currentDate.getSeconds();
            var finalString = hours + ":" + minutes + ":" + seconds;
            return finalString;
        }
        else if (type == 12) {
            var currentDate = new Date();
            var hours = currentDate.getHours();
            if (hours == 24) {
                hours = 12;
                ampm = "AM"
            }
            if (hours > 12) {
                hours = hours - 12;
                ampm = "PM"
            }
            if (hours == 12) {
                hours = 12;
                ampm = "PM"
            }
            var minutes = currentDate.getMinutes();
            var seconds = currentDate.getSeconds();
            var finalString = hours + ":" + minutes + ":" + seconds + " " + ampm;
            return finalString;
        }
    },
    
    //Connects to WebSockets server and creates the link.socket object
    connect : function(ip, port, automaticornot) {
        //check if the function is being called during an autoconnect
        if (automaticornot != true) {
            //This is not being called automatically
            automaticornot = false;
        }
        
        //Initialize a new WebSocket...all JMRI installs will use /json as the path
        link.socket = new WebSocket("ws://" + ip + ":" + port + "/json/")
        
        /*
        On connection open...
        - Indicate newly opened connection status
        - Start the heartbeats to keep it alive
        - Create listeners so JMRI will continually update us with new info on relevant things
        - Display a Materialize.toast about the connection
        */
        link.socket.onopen = function() {
            link.status = true;
            //indicate the connection in the UI
            $("#connectionStatus").html("Connected!").css("color", "green")
            
            //enter it in the log
            console.log("Connection opened with " + cfg.ip + ":" + cfg.port);
            
            //TODO - fix global
            //start the heartbeats to keep it alive
            var heartbeatInterval = setInterval(
                //Heartbeats function embedded into this setInterval call
                function() {
                    link.send('{"type":"ping"}');
                },6000);
            console.log("Beginning heartbeats...")
            
            /*
            LISTENERS - Send a blank command as a request, and JMRI will continually update us on the status of whatever thing...
            - Read more on this at JMRI WebSockets documentation
            */
            link.send('{"type":"power","data":{}}')
            link.send('{"list":"roster"}')
        
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
    
        //Upon receiving a message, log it if logging is enabled, then send it off to the handler
        link.socket.onmessage = function(event) {
            data = JSON.parse(event.data);
            if (cfg.logallmessages == true) {
                var stringified = JSON.stringify(data);
                console.log("[" + timestamp() + "] RECIEVED : " + stringified)
            }
            link.process(data);
        }
    
        //Simple function to throw an error if the WebSocket closes
        link.socket.onclose = function() {
            console.error("WebSocket Closed...")
            Materialize.toast("<i class='material-icons left'>warning</i>Lost connection to JMRI! Please refresh the page and reconnect. <a class='btn-flat orange-text' onclick='location.reload(true)'>Reload</a>");
        }
    },
    
    //Simple wrapper function providing errors/logging for sending WebSockets commands
    send : function(command) {
        //If we're connected, send the command
        if (link.status == true) {
            link.socket.send(command)
            //If logging is enabled, make a console.log entry
            if (cfg.logallmessages == true) {
                console.log("[" + timestamp() + "] SENT : " + command)
            }
        }
        //If we're not connected, throw an error
        else {
            Materialize.toast("<i class='material-icons left'>error</i>You need to connect to JMRI first!", 4000)
            console.error("Cannot send commands - no JMRI connection!")
        }
    },
    
    /*
    AUTOCONNECT
    
    This function is what makes the auto connect feature work. It is at the bottom of index.html, so it runs when the page loads.
    It looks at the cfg object to see if the variables we need are configured or not, and connects if they are set up.
    */
    autoconnect : function() {
        //If it's configured, try to connect
        if (cfg.ip != undefined) {
            link.connect(cfg.ip, cfg.port, true); //the third argument tells the connect() that it's being called automatically
            $("#ip").html(cfg.ip);
            $("#port").html(cfg.port);
                    
            //These two lines go over to the trainsettings tab and scroll up to the top of the page.
            $("#tab_trainsettings").click();
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        //If not, tell the user to connect manually
        else if (cfg.ip == undefined) {
            console.log("No autoconnection settings found!")
            Materialize.toast("<i class='material-icons left'>info</i>Couldn't find any settings for auto-connection, please connect manually.")
                    
            //These two lines go over to the trainsettings tab and scroll up to the top of the page.
            $("#tab_trainsettings").click();
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    },
    
    /*
    MESSAGE HANDLER
    
    This function is called whenever the WebSocket instance (at link.socket) receives a message. It handles passing said message data on to the appropriate recipient based on its "type" field.
    */
    process : function(ev) {
        link.latestMessage = ev
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
}

