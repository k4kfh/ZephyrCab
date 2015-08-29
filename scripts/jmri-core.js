//this contains decoder-agnostic functions for JMRI

//with the current getThrottle() function, you can only have one throttle per instance of LocoThrottleJS. it sets the variables for the rest of the program's throttle info and address info there, so no need to set it yourself.

//some global variable crap that has to be defined
var locoAddress //locomotive's DCC #
var throttleName //name given to throttle requested
var reverser  //direction locomotive should be in (neutral, forward, or reverse),
var JMRIhellomsg  //initial websockets hello message
var layoutRailroadName //the name of the railroad as set in JMRI prefs, only checked on initial connect
var notch = 0 //this is the notch the loco is currently in. DO NOT try to adjust the notch with this, it's only for reading. The only reason it's set here is because it's always supposed to start at 0. if you want to adjust the notch use the function setNotchCrude("up"/"down")
var notchAllowed = true //this is set to true because the program assumes the locomotive is idling, and if we can't run setNotch() at least once it creates an impossibility

//getthrottle grabs a throttle for a locomotive, and refers to it as whatever throttlename is
function getThrottle(address, name) {
    if (wsStatus == true) {
    sendcmd('{"type":"throttle","data":{"throttle":"' + name + '","address":' + address + '}}')
    console.log("Requested throttle " + name + " for locomotive #" + address)
    locoAddress = address
    throttleName = name
    //this runs the init() function, and this sort of thing is why you HAVE to at least define them :P they don't have to do anything at all, just define them
    init("throttleacquired")
    protoEngine_recalc_interval = setInterval(protoEngine_recalc, 1000)
    speedMPH = 0
    }
    else {
        Materialize.toast("You need to set up your WebSockets connection first!", 4000)
    }
    
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
    