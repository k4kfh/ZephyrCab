



//for every decoder, this file should have the following functions. How the functions accomplish their tasks is usually highly decoder-specific, but they must all appear the same to programs that call them. If your decoder does not have these functions, just make them not actually do anything (for example, if the timing is right with sound_notch, it wouldn't send any commands, it would just return "true") and that way you won't break any higher level things

//sound_notch(up or down) - This should be callable by the higher level notching system (Which is decoder-agnostic) and should have the option to notch up or down. It should also have a function that makes the system wait between notches, so a user can't go from notch 1 to 8 in 5 seconds. An example of this can be seen in the function below.
//It's VERY important that the function has a proper return system! If the notch is successful and allowed, return 0. if the notch is not allowed, return string "notAllowed"

//engine("start" or "stop") - This doesn't have to return anything,it's very simple


//notching system

var locoSoundNotchMinTime = 2000 //THIS IS SUPER IMPORTANT: LISTEN UP DEVELOPERS
//if you don't set this, NOTCHING WILL NOT EVER WORK RIGHT
//locoNotchMinTime is the minimum time required for the locomotive's decoder to wait between notches. This is not supposed to be prototypical, higher level stuff handles that, this is simply the min. amount of time you have to wait between calling the sound_notch() function for your decoder to notch correctly. DO NOT FORGET TO SET THIS. DO NOT SET IT TO ZERO. If you don't think there is a min. time, set it to 500ms. If you set it to 0, notching will create a loop that slowly eats all your CPU. DONT. SET. THIS. TO. ZERO.
//this has been a PSA

//this function should be callable with the following:
//sound_notch("up") - notches one up
//sound_notch("down") - notches one down
//sound_notch("reset") - resets the sound notch to 0, in my example simply by keeping the "notch down" function on for a long time, which worked for me on my LokSound decoder used in testing
function sound_notch(direction) {
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


//engine start/stop, call with either true or false
function setEngine(dowhat) {
    //on my LokSound decoder, the engine doesn't play the shutoff sound unless you have it in idle (and i assume you cant shut off a real one unless its idling)
    if (notch == 0) {
    if (dowhat == true) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F8":true, "throttle":"' + throttleName + '"}}');
            console.log("Started engine on EMD 567 ESU LokSound bad-to-the-bone decoder! :D This decoder.js file written by K4KFH");
            engine = true
            updateHTML("engine")
    }
    else if (dowhat == false) {
            //add if(notch == 0) statement here later
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F8":false, "throttle":"' + throttleName + '"}}');
            console.log("Stopped engine on EMD 567 ESU LokSound bad-to-the-bone decoder! D:");
            engine = false
            updateHTML("engine")
    }
    }
}

//compressor and all other sounds (unless otherwise specified) are called with setSoundNameChosen(true/false)
//compressor
function setCompressor(dowhat) {
    if (dowhat == true) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F20":true, "throttle":"' + throttleName + '"}}');
            compressor = true
            console.log("Compressor started.")
            updateHTML("compressor")
    }
    if (dowhat == false) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F20":false, "throttle":"' + throttleName + '"}}');
            compressor = false
            console.log("Compressor stopped.")
            updateHTML("compressor")
    }
}


//air bell
function setBell(dowhat) {
    if (dowhat == true) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F1":true, "throttle":"' + throttleName + '"}}');
            bell = true
            updateHTML("bell")
    }
    else if (dowhat == false) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F1":false, "throttle":"' + throttleName + '"}}');
            bell = false
            updateHTML("bell")
    }
}



//air horn
function setHorn(dowhat) {
    if (dowhat == true) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F2":true, "throttle":"' + throttleName + '"}}');
            horn = true
            console.log("Horn on.")
        }
    if (dowhat == false) {
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F2":false, "throttle":"' + throttleName + '"}}');
            horn = false
            console.log("Horn off.")
    }
}



function JSONhandleType_throttle_functions(json) {
    if (json.F1 !=undefined) {
        if (bell != json.F1) {
            setBell(json.F1)
            debugToast("JSON handler ran setBell(), with JSON value " + json.F1, 4000)
        }
    }
    if (json.F2 != undefined) {
        if (horn != json.F2) {
        //nothing here, just for organization and potential future feature...but since the horn is a button its not workable like the switches
            debugToast("JSON handler ran setHorn() dummy, with JSON value " + json.F2, 4000)
        }
    }
    if (json.F8 != undefined) {
        if (engine != json.F8) {
            setEngine(json.F8)
            debugToast("JSON handler ran setEngine(), with JSON value " + json.F8, 4000)
        }
    }
    if (json.F20 != undefined) {
        if (compressor != json.F20) {
            setCompressor(json.F20)
            debugToast("JSON handler ran setCompressor(), with JSON value " + json.F20, 4000)
        }
    }
    
}


//called with headlight(boolean)
function setHeadlight(dowhat) {
    //dummy function, this decoder has a messed up light
    headlight = dowhat
}
    