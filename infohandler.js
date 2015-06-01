//this file contains all the variables and info about the layout and the locomotive, plus the functions to keep them up to date

var layoutTrackPower_state


//takes in string of type power and uses it to update power info
function JSONhandleType_power(string) {
    var json = string
    if (json.data.state == 2) {
        layoutTrackPower_state = true
        console.log("Updated layout track power status to TRUE")
    }
    else if (json.data.state == 4) {
        layoutTrackPower_state = false
        console.log("Updated layout track power status to FALSE")
    }
    
}

//this runs the second the websockets connection is open, it sets up any listeners to constantly let LocoThrottle know when the state of something changes.
function setListeners() {
    sendcmd('{"type":"power","data":{}}')
}