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
            console.log("Set reverser to FORWARD")
            reverserSet = true
            updateHTML("reverser")
        }
        else if (ignoreNotch == true) {
            reverser = "forward"
            console.log("Set reverser to FORWARD")
            reverserSet = true
            updateHTML("reverser")
            }
        
    }
    else if (direction == "reverse") {
        if (notch == 0) {
            reverser = "reverse"
            console.log("Set reverser to REVERSE")
            reverserSet = true
            updateHTML("reverser")
        }
        else if (ignoreNotch == true) {
            reverser = "reverse"
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

function protoEngine_accel(ARGnotch, ARGreverser) {
 if (locoAddress != undefined) {
     //rewritten as of July 4th 2015
     
     
     
     //begin physics
     
     //MOTIVE FORCE: negative #s are reverse motive force
     console.log("Current speed: " + speedMPH)
     //finds how much horsepower the engine is putting out right now
     outputHP = maxHP * (ARGnotch/8)
     console.log("Output HP found to be: " + outputHP)
     
     
     
     if (speedMPH > 0) {
         //if the loco is going forward, calculate wind this way
     
        wind = speedMPH
        console.log("Wind experienced on the front of the loco [mph] = " + wind)
     
        airResistanceCoeff = locoFrontArea * ((wind * wind) * 0.00256)
        console.log("Air Resistance Coeff = " + airResistanceCoeff)
     
        windResistance = (airResistanceCoeff) * (wind ^ 2)
        console.log("Wind Resistance = " + windResistance)
        //done with wind
     }
     else if (speedMPH < 0) {
         //if the loco is going backward, calculate wind this way
         wind = speedMPH
         console.log("Wind experienced on the back of the loco [mph] = " + wind)
         
         airResistanceCoeff = locoRearArea * ((wind * wind) * 0.00256)
         console.log("Air resistance Coeff = " + windResistance)
         
         windResistance = -1 * ((airResistanceCoeff) * (wind ^ 2))
         console.log("Wind Resistance = " + windResistance)
         //this logic above here ^^^ is flipped to use the back end of the loco when in reverse
         
     }
     else {
         windResistance = 0
         console.log("Wind Resistance = 0 because loco is stationary...")
     }
     
     //find total motive force, both reverse and forward, by subtracting wind resistance from force generated by the loco
     if (reverser == "forward") {
         motiveForce = (outputHP * 550) - windResistance
         console.log("Total motive force: " + motiveForce)
     }
     
     else if (reverser == "reverse") {
         motiveForce = ((outputHP * 550) * -1) - (windResistance)
         console.log("Total motive force: " + motiveForce)
     }
     
     else {
         motiveForce = 0
         console.log("Total motive force: " + motiveForce)
     }
     
     
     //RESISTANCE STARTS
     
     //rolling resistance
     rollingResistance = ((0.001 * locoWeight * 32.2))
     console.log("Rolling resistance: " + rollingResistance)
     
     
     //this part has been redone, this is clunky but shows the purpose, will be tidied up later
     if (speedMPH == 0) {
         totalResistance = 0
         console.log("Total resistance: " + totalResistance)
     }
     else if (speedMPH <= 0) {
         totalResistance = -1 * (rollingResistance)
     }
     else if (speedMPH >= 0) {
         totalResistance = rollingResistance
     }
     
     
     acceleration = (motiveForce - totalResistance)/locoWeight
     
     console.log("ACCEL in MPH/sec: " + acceleration)
     
     //this assumes you're running the function every 100ms
     //we convert the acceleration value from mph/sec to mph/100ms
     //then we find the new speed and set it
     var accel_highres = acceleration / 10
     
     var newSpeed = speedMPH + accel_highres
     
     //GUESS WHAT
     //THIS IS SUPER WONKY
     //THIS IS HERE TO KEEP THE SPEED FROM PERPETUALLY BOUNCING AROUND 0, BUT NEVER HITTING 0
     //THIS IS STILL HIGHLY DEVELOPMENT-ISH
     //IT WAS ALSO WRITTEN AT 1:30AM SO BEAR THAT IN MIND
     //AFAIK IT WORKS AS OF JULY 8TH 2015 AT 1:30AM, BUT THAT DOESNT SAY MUCH
     //THIS HAS BEEN A PUBLIC SERVICE ACCOUNCEMENT
     if (newSpeed < 0.001) {
         if (newSpeed > -0.001) {
             speedMPH = 0
         }
     }
     else {
        speedMPH = newSpeed
     }
     
     //figures out speed in percent from speed in mph
     if (speedMPH < 0) {
         setModelDirection("reverse")
         var locoSpeed = locoSpeedCrunch(Math.abs(speedMPH))
         sendcmdLocoSpeed(locoSpeed)
         console.log("Sending " + locoSpeed + " as model speed.")
     }
     else if (speedMPH > 0) {
         setModelDirection("forward")
         var locoSpeed = locoSpeedCrunch(Math.abs(speedMPH))
         console.log("Sending " + locoSpeed + " as model speed.")
         sendcmdLocoSpeed(locoSpeed)
     }
     else {
         sendcmdLocoSpeed(0)
         console.log("Loco is stationary, setting speed to 0 and ignoring reverser.")
         modelDirection = reverser
     }
     
     
     console.log("Speed recalculated after 0.1 sec to be: " + newSpeed)
     
     
     
 }
    else {
        alert("You haven't requested a throttle yet. We can't do squat. Wait. How did you even manage to...never mind")
    
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
    console.log("Set MODEL direction to " + ARGdirection)
    
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
        alert("It's near impossible to disconnect when you're not connected in the first place...")
    }
}