//this file contains all the variables and info about the layout and the locomotive, plus the functions to keep them up to date

var layoutTrackPower_state
var reverser


//takes in string of type power and uses it to update power info
function JSONhandleType_power(string) {
    var json = string
    if (json.data.state == 2) {
        layoutTrackPower_state = true
        console.log("Updated layout track power status to TRUE")
        updateHTML("layoutTrackPower_state")
    }
    else if (json.data.state == 4) {
        layoutTrackPower_state = false
        console.log("Updated layout track power status to FALSE")
        updateHTML("layoutTrackPower_state")
    }
    
}

//this runs the second the websockets connection is open, it sets up any listeners to constantly let LocoThrottle know when the state of something changes.
function setListeners() {
    sendcmd('{"type":"power","data":{}}')
}

function JSONhandleType_throttle(json) {
    var throttleData = json.data
    //since function numbers vary among decoders, we will pass off this data to a function in decoder.js called JSONhandleType_throttle_functions
    JSONhandleType_throttle_functions(throttleData)
    
    //the reverser gets a bit cumbersome...PLEASE do not change this across decoders!
    //this is decoder agnostic and works fine so don't fiddle with it if you can avoid it
    if (json.data.forward == true) {
        setReverser("forward", true)
        setModelDirection("forward")
    }
    else if (json.data.forward == false) {
        setReverser("reverse", true)
        setModelDirection("reverse")
    }
    
    //speed gatherer
    if (json.data.speed != undefined) {
        currentSpeed = json.data.speed * 100
        console.log("Updated currentSpeed to " + currentSpeed)
    }
}