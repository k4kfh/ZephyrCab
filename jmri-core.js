//this contains decoder-agnostic functions for JMRI

//with the current getThrottle() function, you can only have one throttle per instance of LocoThrottleJS. it sets the variables for the rest of the program's throttle info and address info there, so no need to set it yourself.


//getthrottle grabs a throttle for a locomotive, and refers to it as whatever throttlename is
function getThrottle(address, name) {
    sendcmd('{"type":"throttle","data":{"throttle":"' + name + '","address":' + address + '}}')
    console.log("Requested throttle " + name + " for locomotive #" + address)
    locoAddress = address
    throttleName = name
    //this runs the init() function, and this sort of thing is why you HAVE to at least define them :P they don't have to do anything at all, just define them
    init("throttleacquired")
    protoEngine_recalc_interval = setInterval(protoEngine_recalc, 100)
    speedMPH = 0
    
}



//call with state as string, either "on", "off", or "toggle"
function trkpower(option) {
    if (option == "on") {
        sendcmd('{"type":"power","data":{"state":2}}')
        console.log("Track power set to ON")
        updateHTML("layoutTrackPower_state")
    }
    else if (option == "off") {
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
    