//this contains decoder-agnostic functions for JMRI

//a few global variables conveniently defined here for now
var reverser //this is just set here because reasons
var notch = 0

jmri = new Object();


//you can call this with keyword new to create a new throttle object that has all the functions of a working throttle. no decoder-specific anything, just like it would be on a Digitrax throttle or something

//example: exampleThrottle = new jmri.throttle(1379, 0)
//now I can run exampleThrottle.f.set(0, true) to turn on #1379's headlight. You get the idea.
jmri.throttle = function(address, throttleName) {
    if (wsStatus == true) {
        //this second if statement makes sure we have our decoder.js script loaded, because this is super duper important and yeah
        sendcmd('{"type":"throttle","data":{"throttle":"' + throttleName + '","address":' + address + '}}')
        console.log("Requested throttle " + name + " for locomotive #" + address)
        this.address = address
        this.name = throttleName //throttle name should always be the train position just for ease-of-development purposes
        this.speed = new Object(); //same reason as this.f for existing as a seemingly stupid object
        this.speed.set = function(speed) {
            //set speed to given percent
            sendcmd('{"type":"throttle","data":{"address":' + address + ', "throttle":"' + throttleName + '", "speed":' + speed + '}}')
        }
        this.f = new Object(); //the reason we did this as an object with only one function was to leave room for future ability to store the states of the functions. I will add it if I need it, but its a pain so I haven't yet.
        this.f.set = function(fnumber, state) {
            //set the function number from fnumber to the state from state
            sendcmd('{"type":"throttle","data":{"address":' + address + ', "F' + fnumber + '":' + state + ', "throttle":"' + throttleName + '"}}')
        }
        
        //TODO - add command here so that when a throttle is acquired, all functions are set to off and the speed to 0
    }
    else {
        Materialize.toast("You need to set up your WebSockets connection first!", 4000)
    }
    
}


//call with state as boolean
jmri.trkpower = function(option) {
    if (option == true) {
        sendcmd('{"type":"power","data":{"state":2}}')
        console.log("Track power set to ON")
        updateHTML("layoutTrackPower_state")
    }
    else if (option == false) {
        sendcmd('{"type":"power","data":{"state":4}}')
        console.log("Track power set to OFF")
        updateHTML("layoutTrackPower_state")
    }
    
    else if (option == "toggle") {
        //if track power is currently on, turn it off
        if (layoutTrackPower_state == true) {
            sendcmd('{"type":"power","data":{"state":4}}')
        console.log("Track power set to OFF")
        updateHTML("layoutTrackPower_state")
        }
        //if its currently off, turn it on
        else if (layoutTrackPower_state == false) {
            sendcmd('{"type":"power","data":{"state":2}}')
        console.log("Track power set to ON")
        updateHTML("layoutTrackPower_state")
        }
    }
}

jmri.railroadName = "Railroad" //this is set upon connection
jmri.hellomsg //initial railroad hello message

jmri.handleType = new Object(); //this contains all the non-locomotive/throttle related handler functions
jmri.handleType.power = function(string) {
    var json = string
    if (json.data.state == 2) {
        jmri.trkpower.state = true
        console.log("Updated layout track power status to TRUE")
        updateHTML("layoutTrackPower_state")
    }
    else if (json.data.state == 4) {
        jmri.trkpower.state = false
        console.log("Updated layout track power status to FALSE")
        updateHTML("layoutTrackPower_state")
    }
}
    