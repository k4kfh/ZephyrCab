//this contains high level locomotive functions, usually (at least mostly) decoder agnostic. These functions call functions from decoder.js in order to communicate with the locomotive

//call this with setReverser([either forward, reverse, or neutral, as a string], [true ONLY if you want the reverser to ignore whether or not the engine is idling to change speed. Do this only in special circumstances. not inputting anything for ignoreNotch sets it to false.])
//setReverser returns true if the reverser was able to be set as specified, and false if otherwise

actualDirection = 0




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
            reverser = 1
            console.log("Set reverser to FORWARD")
            reverserSet = true
            updateHTML("reverser")
        }
        else if (ignoreNotch == true) {
            reverser = 1
            console.log("Set reverser to FORWARD")
            reverserSet = true
            updateHTML("reverser")
            }
        
    }
    else if (direction == "reverse") {
        if (notch == 0) {
            reverser = -1
            console.log("Set reverser to REVERSE")
            reverserSet = true
            updateHTML("reverser")
        }
        else if (ignoreNotch == true) {
            reverser = -1
            console.log("Set reverser to REVERSE")
            reverserSet = true
            updateHTML("reverser")
            }
        
    }
    
    else if (direction == "neutral") {
        if (notch == 0) {
            reverser = 0
            console.log("Set reverser to NEUTRAL")
            reverserSet = true
            updateHTML("reverser")
        }
        else if (ignoreNotch == true) {
            reverser = 0
            console.log("Set reverser to NEUTRAL")
            reverserSet = true
            updateHTML("reverser")
            }
        
        
    }
    return reverserSet
    }
    else {
        Materialize.toast("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P", 4000)
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



//this is the new high level setnotch function
function setNotch(newNotch) {
    notchDiffABS = Math.abs(notch - newNotch) //this finds the difference between the new and old notches
    if (notchDiffABS == 1) {
        //it's okay to notch up
        notchDiffReal = newNotch - notch //we use this number, negative or positive, to determine which DIRECTION to notch it
        if (notchDiffReal == 1) {
            //notch up
            setNotchCrude("up")
        }
        else if (notchDiffReal == -1) {
            //notch down
            setNotchCrude("down")
        }
    }
    else {
        Materialize.toast("You can only move the throttle one notch at a time.", 4000)
    }
}

//this is the high level notching system. ANYTHING that adjusts the notch should NOT USE THIS. Use setNotch() instead, which is built on top of this. Weird, but it works. It is decoder agnostic because it calls functions from decoder.js, which behave the same across decoders, but the code inside is decoder specific. This allows a simple, unified approach to make the higher level function below work with all decoders that there exists a decoder.js for
//setnotchcrude is called with setNotchCrude(up or down) and it returns the new notch as a number
function setNotchCrude(dowhat) {
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
        Materialize.toast("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P", 4000)
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
        Materialize.toast("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P", 4000)
    }
}



//this is what calculates the speed for the locomotive
//this is basically where it all goes down

//the reason all the variables have ARG in front of them is so that inside the function, we can still access global variables that have been set for information about the various things
//basically to prevent 2 variables in different scopes with the same name

function protoEngine_accel(ARGnotch, ARGreverser) {
 if (locoAddress != undefined) {
     //rewrite on July 24th to support minimal if/else usage
     
     //first find output motive force
     outputEngineForce = reverser * (((notch/prototypeMaxNotch) * prototypeMaxHP) * 550) //result is in ft-lbs, and works with any set of loco values. reverser math is there so when the reverser is in reverse, we get a negative number
     console.log("Output Engine Force = " + outputEngineForce)
     
     //we must use if's for wind resistance due to uncontrollably different front/rear cross-sectional areas
     wind = Math.abs(speedMPH)
     console.log("Wind = " + wind)
     if (actualDirection == 1) {
         windResistance = locoFrontArea * ((wind^2) * 0.00256) //wind resistance for forward movement
         console.log("Wind Resistance = " + windResistance)
     }
     if (actualDirection == -1) {
         windResistance = -1 * (locoRearArea * ((wind^2) * 0.00256)) //we multiply by negative 1 so that we go towards zero when the loco is moving backwards
         console.log("Wind Resistance = " + windResistance)
     }
     if (actualDirection == 0) {
         windResistance = 0
         console.log("Wind Resistance = 0")
     }
     //now we know wind resistance
     
     //rolling resistance code
     rollingResistance = actualDirection * (0.001 * locoWeight) //very simple math, 0.001 is the coefficient of rolling resistance, and the actualDirection math is to put it in the correct polarity based on direction of travel
     console.log("Rolling Resistance = " + rollingResistance)
     
     //net force code
     netForce = outputEngineForce - (windResistance + rollingResistance)
     console.log("Net Force = " + netForce)
     
     acceleration = netForce / locoWeight //this whole thing is a big f=ma problem
     console.log("Acceleration = " + acceleration)
     
     newSpeed = speedMPH + acceleration
     console.log("Speed = " + speedMPH)
     
     
     //this code is not for physics purposes, it is purely to keep the program from looping and locking up
     //it forces the speed to cross exactly 0 when changing direction, without impacting how fast it does so
     if (speedMPH > 0) { //if speed is positive right now,
         if (newSpeed < 0) { //and it's about to flip to negative
             newSpeed = 0 //make sure it crosses exactly 0 once
             console.log("Forcing zero crossing")
         }
     }
     else if (speedMPH < 0) {
         if (newSpeed > 0) {
             newSpeed = 0
             console.log("Forcing zero crossing")
         }
     }
     
     
     
     
     
     
     
     speedMPH = newSpeed //seems counterproductive but it's needed to ensure forced zero crossing, which cuts down on wasted CPU
     //update ui.js
     updateHTML("speedMPH")
     if (speedMPH < 0) {
         setModelDirection("reverse")
         actualDirection = -1
         var locoSpeed = locoSpeedCrunch(Math.abs(speedMPH))
         sendcmdLocoSpeed(locoSpeed)
     }
     else if (speedMPH > 0) {
         setModelDirection("forward")
         actualDirection = 1
         var locoSpeed = locoSpeedCrunch(Math.abs(speedMPH))
         sendcmdLocoSpeed(locoSpeed)
     }
     else {
         sendcmdLocoSpeed(0)
         actualDirection = 0
         console.log("Loco is stationary, setting speed to 0 and ignoring reverser.")
     }
     
     
     
 }
    else {
        Materialize.toast("You haven't requested a throttle yet. We can't do squat. Wait. How did you even manage to...never mind", 4000)
    
    }
}






//moved this to protoEngine.js for simplicity's sake, because it's such an important part of the engine, it's less of a low level network function and more of a high level Engine function
//this function is used for sending any SPEED RELATED commands to a locomotive (handled only by ProtoEngine() ). It's what handles the reverser's weird hard-to-deal-with NEUTRAL setting
//old function, left it commented out just in case I need to look
//function sendcmdLocoSpeed(speed) {
//    speed = Math.round(speed / 100)
//    if(reverser = "forward") {
//        sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "throttle":"' + throttleName + '", "speed":' + speed + '}}')
//        currentSpeed = speed
 //   }
 //   else if (reverser = "reverse") {
//        speedABS = Math.abs(speed)
//        
//        sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "throttle":"' + throttleName + '", "speed":' + speedABS + '}}')
//        currentSpeed = speedABS
//    }
//    else{
//        console.log("Reverser is set to neutral, so we aren't sending the requested speed command to the engine.")
//    }
    
    
//}

function sendcmdLocoSpeed(ARGspeed) {
    speedJMRIformat = ((Math.round(ARGspeed)) / 100)
    sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "throttle":"' + throttleName + '", "speed":' + speedJMRIformat + '}}')
    
}

function setModelDirection(ARGdirection) {
    if (ARGdirection == "forward") {
        sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "forward":true, "throttle":"' + throttleName + '"}}')
        modelDirection = "forward"
    }
    else if (ARGdirection == "reverse") {
        sendcmd('{"type":"throttle","data":{"address":' + locoAddress + ', "forward":false, "throttle":"' + throttleName + '"}}')
        modelDirection = "reverse"
    }
    //console.log("Set MODEL direction to " + ARGdirection)
    
}






function protoEngine_recalc() {
    protoEngine_accel(notch, reverser)
    
}




//still in development, need to make it where when it closes it stops the heartbeats but im doing other things
function disconnnect() {
    if(wsStatus == true) {
        sendcmd('{"type":"goodbye"}')
        
        
    }
    else {
        Materialize.toast("It's near impossible to disconnect when you're not connected in the first place...", 4000)
    }
}