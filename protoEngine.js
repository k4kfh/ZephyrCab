//this contains high level locomotive functions, usually (at least mostly) decoder agnostic. These functions call functions from decoder.js in order to communicate with the locomotive

//call this with setReverser([either forward, reverse, or neutral, as a string], [true ONLY if you want the reverser to ignore whether or not the engine is idling to change speed. Do this only in special circumstances. not inputting anything for ignoreNotch sets it to false.])
//setReverser returns true if the reverser was able to be set as specified, and false if otherwise
function setReverser(direction, ignoreNotch) {
    var pastReverser = reverser
    var reverserSet = false
    //causes the "ignore the current notch" parameter to default to false, in case a dev forgets it
    if (ignoreNotch == undefined) {
        var ignoreNotch = false
    }
    //basically the same code (with different directions) under 3 different if statements for possible directions
    if (direction == "forward") {
        if (notch == 0) {
            reverser = "forward"
            if (pastReverser != reverser) {
                sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "forward":true, "throttle":"' + throttleName + '"}}')
            }
            console.log("Set reverser to FORWARD")
            reverserSet = true
        }
        else if (ignoreNotch == true) {
            reverser = "forward"
            if (pastReverser != reverser) {
                sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "forward":true, "throttle":"' + throttleName + '"}}')
            }
            console.log("Set reverser to FORWARD")
            reverserSet = true
            }
        
    }
    else if (direction == "reverse") {
        if (notch == 0) {
            reverser = "reverse"
            if (pastReverser != reverser) {
                sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ',"forward":false, "throttle":"' + throttleName + '"}}')
            }
            console.log("Set reverser to REVERSE")
            reverserSet = true
        }
        else if (ignoreNotch == true) {
            reverser = "reverse"
            if (pastReverser != reverser) {
                sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ',"forward":false, "throttle":"' + throttleName + '"}}')
            }
            console.log("Set reverser to REVERSE")
            reverserSet = true
            }
        
    }
    
    else if (direction == "neutral") {
        if (notch == 0) {
            reverser = "neutral"
            console.log("Set reverser to NEUTRAL")
            reverserSet = true
        }
        else if (ignoreNotch == true) {
            reverser = "neutral"
            console.log("Set reverser to NEUTRAL")
            reverserSet = true
            }
        
        
    }
    return reverserSet
}