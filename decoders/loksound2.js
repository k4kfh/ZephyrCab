var decoder = new Object();

//LokSound.js Version 2 - Syntactical Overhaul
//Started on 11/6/15

decoder.f = {} //This will contain a variable for each sound. To set a sound/function, you will call decoder.f.(thename).set(state) and you will be able to find the state of the sound with variable decoder.f.(thename)
//If anyone is wondering, f is short for function. I used f instead of the full word because typing "function" is a lot longer than typing "f".

//List of all the functions in a decoder, set to false by default
decoder.f.bell = false
decoder.f.horn = false
decoder.f.headlight = false
decoder.f.compressor = false
decoder.f.notchSound //This is the only one of these which does not have a boolean state. It doesn't have an integer state either.

decoder.f.bell.set = function(state) {
    if (state == true) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F1":true, "throttle":"' + throttleName + '"}}');
            decoder.function.bell = true
            updateHTML("bell")
    }
    else if (state == false) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F1":false, "throttle":"' + throttleName + '"}}');
            decoder.function.bell = false
            updateHTML("bell")
    }
}

decoder.f.horn.set(state) {
    if (state == true) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F2":true, "throttle":"' + throttleName + '"}}');
            decoder.function.horn = true
            console.log("Horn on.")
        }
    if (state == false) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F2":false, "throttle":"' + throttleName + '"}}');
            decoder.function.horn = false
            console.log("Horn off.")
    }
}

decoder.f.headlight.set(state) {
    //The headlight on the loco I wrote this for doesn't work, so this is a dummy function.
    headlight = dowhat
}

decoder.f.compressor.set(state) {
    if (state == true) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F20":true, "throttle":"' + throttleName + '"}}');
            decoder.function.compressor = true
            console.log("Compressor started.")
            updateHTML("compressor")
    }
    if (state == false) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F20":false, "throttle":"' + throttleName + '"}}');
            decoder.function.compressor = false
            console.log("Compressor stopped.")
            updateHTML("compressor")
    }
}

decoder.f.engine.set(state) {
    //on my LokSound decoder, the engine doesn't play the shutoff sound unless you have it in idle (and i assume you cant shut off a real one unless its idling)
    if (notch == 0) {
        if (state == true) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F8":true, "throttle":"' + throttleName + '"}}');
            console.log("Started engine on EMD 567 ESU LokSound bad-to-the-bone decoder! :D This decoder.js file written by K4KFH");
            decoder.f.engine = true
            updateHTML("engine")
        }
        else if (state == false) {
            //add if(notch == 0) statement here later
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F8":false, "throttle":"' + throttleName + '"}}');
            console.log("Stopped engine on EMD 567 ESU LokSound bad-to-the-bone decoder! D:");
            decoder.f.engine = false
            updateHTML("engine")
        }
    }
}

decoder.f.notchSound.set(state) {
    var soundNotchAllowed //this tells if the engine can safely go up a notch. Of course, the HO loco is electric, so it doesn't really matter, but we're shooting for realism here, and it's not really realistic to go from notch 0 to notch 8 in 1 second :P this isn't global because the global version of this variable is prototypical timing, so we don't need it global
    
    if (locoAddress != undefined) {
        
    notchSuccess = false
    
    if (soundNotchAllowed != false) {
        
        //don't allow another notch change for however long
        soundNotchAllowed = false
        
        if (direction == "up") {
            notchSuccess = true
            //send commands to the decoder to make the prime mover sound "notch up"
            setTimeout(function() { sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "F9":true, "throttle":"' + throttleName + '"}}'); console.log("Sent command to soundNotch up")}, 500)
    setTimeout(function() { sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "F9":false, "throttle":"' + throttleName + '"}}'); console.log("Sent command to soundNotch up")},  1750)
            //after this long (in ms) allow notch change again
            setTimeout(function() {soundNotchAllowed = true}, locoSoundNotchMinTime)
        }
        else if (direction == "down") {
            notchSuccess = true
            //send commands to notch down
            setTimeout(function() { sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "F10":true, "throttle":"' + throttleName + '"}}'); console.log("Sent command to soundNotch down")}, 500)

    setTimeout(function() { sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "F10":false, "throttle":"' + throttleName + '"}}'); console.log("Sent command to soundNotch down")}, 1750)
            //after this long (in ms) allow notch change again
            setTimeout(function() {soundNotchAllowed = true}, locoSoundNotchMinTime)
            
        }
        else if (direction == "reset") {
            //hold down "notch down" button for 15 seconds to make sure we get to 0
            setTimeout(function() { sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "F10":true, "throttle":"' + throttleName + '"}}'); console.log("Sent command to soundNotch down-RESETTING NOTCH TO 0")}, 500)
            setTimeout(function() { sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "F10":false, "throttle":"' + throttleName + '"}}'); console.log("NOTCH RESET COMPLETE"); setNotchCrude(0, "resetmode");}, 15000)
            //shut engine off
            setTimeout(function() {setEngine(false)}, 16000)
            notchSuccess = true
            
        }
    }
        //this returns true if we were allowed to notch, false if we were not allowed to notch. you MUST have this return that, higher level ProtoEngine functions rely on it!
    return notchSuccess;
    }
    //self explanatory alert system :P
    else {
        Materialize.toast("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P", 4000)
    }
}