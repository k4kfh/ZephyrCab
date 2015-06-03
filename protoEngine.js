//this contains high level locomotive functions, usually (at least mostly) decoder agnostic. These functions call functions from decoder.js in order to communicate with the locomotive

//call this with setReverser([either forward, reverse, or neutral, as a string], [true ONLY if you want the reverser to ignore whether or not the engine is idling to change speed. Do this only in special circumstances. not inputting anything for ignoreNotch sets it to false.])
//setReverser returns true if the reverser was able to be set as specified, and false if otherwise
function setReverser(direction, ignoreNotch) {
    //this if statement replaces the sendcmd function, since its more effective to do custom code here
    if (locoAddress != undefined) {
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
            updateHTML("reverser")
        }
        else if (ignoreNotch == true) {
            reverser = "forward"
            if (pastReverser != reverser) {
                sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "forward":true, "throttle":"' + throttleName + '"}}')
            }
            console.log("Set reverser to FORWARD")
            reverserSet = true
            updateHTML("reverser")
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
            updateHTML("reverser")
        }
        else if (ignoreNotch == true) {
            reverser = "reverse"
            if (pastReverser != reverser) {
                sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ',"forward":false, "throttle":"' + throttleName + '"}}')
            }
            console.log("Set reverser to REVERSE")
            reverserSet = true
            updateHTML("reverser")
            }
        
    }
    
    else if (direction == "neutral") {
        if (notch == 0) {
            reverser = "neutral"
            console.log("Set reverser to NEUTRAL")
            reverserSet = true
            updateHTML("reverser")
        }
        else if (ignoreNotch == true) {
            reverser = "neutral"
            console.log("Set reverser to NEUTRAL")
            reverserSet = true
            updateHTML("reverser")
            }
        
        
    }
    return reverserSet
    }
    else {
        alert("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P")
        return false
    }
}

//this is used to set the locomotive brake. The number is used as a percent, so brakeSetting needs to be from 0 to 100. How you feed that to it is up to you.
//it, too, calls updateHTML("locoBrake") so you can have your HTMLcab display the current brake setting
function setLocoBrake(brakeSetting) {
    locoBrake = brakeSetting
    updateHTML("locoBrake")
    ProtoEngine_Speed(notch, locoBrake)
    console.log("Set locomotive air brake to " + locoBrake + "%")
}






//this is the high level notching system. ANYTHING that adjusts the notch should ALWAYS use this. It is decoder agnostic because it calls functions from decoder.js, which behave the same across decoders, but the code inside is decoder specific. This allows a simple, unified approach to make the higher level function below work with all decoders that there exists a decoder.js for
//setnotch is called with setnotch(up or down) and it returns the new notch as a number


function setNotch(dowhat) {
    //this if statement takes the place of sendcmdLoco(), since we may be sending several commands within setNotch(). Don't want to make anyone throw their computer out the window because of 6 billion alert() functions!
    if (locoAddress != undefined) {
        if (notchAllowed == true) {
        
        //this if else if... statement checks if we're notching up, down, setting a notch as a number, or resetting the notching. //setting as a number not done yet
        
        if (dowhat == "up") {
            //be sure notches stay within acceptable range
            if(notch < prototypeMaxNotch) {
                //notch the sound up, adjust the notch variable
                notch++
                sound_notch("up")
                //call that function from ui.js that can be customized to fit your specific HTML code
                updateHTML("notch")
                //reset the timing wait system of the notch thing
                notchTiming("reset")
                //PROTOENGINE COMMAND HERE
                ProtoEngine_Speed(notch)
            }
        }
        else if (dowhat == "down") {
            //be sure notches stay within acceptable range
            if(notch > 0) {
                //notch the sound down, adjust the notch variable
                notch--
                sound_notch("down")
                updateHTML("notch")
                notchTiming("reset")
                //PROTOENGINE COMMAND HERE
                ProtoEngine_Speed(notch)
            }
        }
        else if (dowhat == "reset") {
            //this calls all the notching resetting functions, including resetting the sound notch if the locomotive has those
            console.log("Full notching reset by setNotch() BEGIN")
            sound_notch("reset")
            notch = 0
            updateHTML("notch")
            //PROTOENGINE COMMAND HERE
            ProtoEngine_Speed(0)
        }
            
        }
        //if notch isn't allowed, then
        else {
            //if the notch request isnt allowed because of ProtoEngine's timing settings, then run the notchDisallowed()
            notchDisallowed("timing")
        }
        
    }
    else {
        alert("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P")
    }
return notch;
}



//this can be called with "reset" every time the notch is changed so that it disallows the notch to be changed for protoEngineNotchWait's time
function notchTiming(args) {
    //first IF statement to be sure we're actually throttling a locomotive here
     if (locoAddress != undefined) {
         if(args == "reset") {
          notchAllowed = false
          setTimeout(function() {notchAllowed = true}, protoEngineNotchWait)
          setTimeout(function() {console.log("Notching allowed again!")}, protoEngineNotchWait)
         }
         else if (args == "allow") {
             notchAllowed = true
         }
         else if (args == "disallow") {
             notchAllowed = false
         }
        
     }
    //more of failsafe loco check system
    else {
        alert("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P")
    }
}



//this is what calculates the speed for the locomotive
//this is basically where it all goes down

//the reason all the variables have ARG in front of them is so that inside the function, we can still access global variables that have been set for information about the various things
//basically to prevent 2 variables in different scopes with the same name

function ProtoEngine_Speed(ARGnotch, ARGlocoBrake, ARGtrainBrake, ARGdynBrake, ARGreverser) {
 if (locoAddress != undefined) {
     //actual code can run
     //the reverser function handles setting the direction itself, because that's so simple, except for one thing:
     //NEUTRAL
     //if the reverser is in neutral, we dont need to send ANY speed commands to the locomotive
     //so for any speed related commands, we use the function sendcmdLocoSpeed(command) which only actually sends the command if the reverser is in either fwd or rev.
     //saves time
     
     
     //this is it, this is the speed finding equation
     var newLocoSpeedNoBrakes = (((ARGnotch/locoMaxNotch) * locoMaxSpeed) / 100)
     var newLocoSpeed = newLocoSpeedNoBrakes - (newLocoSpeedNoBrakes * (ARGlocoBrake / 100))
     //this function is decoder agnostic and is used for speed stuff because its got momentum and crap like that
     //if you're wondering it's in websockets.js
     sendcmdLocoSpeed(newLocoSpeed)
     
 }
    else {
        alert("You haven't requested a throttle yet. We can't do squat. Wait. How did you even manage to...never mind")
    
}
    return newLocoSpeed
}






//moved this to protoEngine.js for simplicity's sake, because it's such an important part of the engine, it's less of a low level network function and more of a high level Engine function
//this function is used for sending any SPEED RELATED commands to a locomotive (handled only by ProtoEngine() ). It's what handles the reverser's weird hard-to-deal-with NEUTRAL setting
function sendcmdLocoSpeed(speed) {
    if(reverser != "neutral") {
        sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "throttle":"' + throttleName + '", "speed":' + speed + '}}')
    }
    else{
        console.log("Reverser is set to neutral, so we aren't sending the requested speed command to the engine.")
    }
    
    
}

function setRPM(notch) {
    if (notch == 0) {
        rpm = prototypeMinRPM
        console.log("Notch is 0 (Idle) so updating prime mover RPM to " + rpm + " (Idle RPM specified in globalvars.js)")
    }
    else {
        rpm = (((prototypeMaxRPM - prototypeMinRPM) / prototypeMaxNotch) * notch) //finds RPM based on min/max RPM and current notch


//still in development, need to make it where when it closes it stops the heartbeats but im doing other things
function disconnnect() {
    if(wsStatus == true) {
        sendcmd('{"type":"goodbye"}')
        
        
    }
    else {
        alert("It's near impossible to disconnect when you're not connected in the first place...")
    }
}