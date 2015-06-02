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
    else {
        alert("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P")
    }
}

//this is the high level notching system. ANYTHING that adjusts the notch should ALWAYS use this. It is decoder agnostic because it calls functions from decoder.js, which behave the same across decoders, but the code inside is decoder specific. This allows a simple, unified approach to make the higher level function below work with all decoders that there exists a decoder.js for
//setnotch is called with setnotch(up or down) and it returns the new notch as a number
function setNotch(dowhat) {
    //this if statement takes the place of sendcmdLoco(), since we may be sending several commands within setNotch(). Don't want to make anyone throw their computer out the window because of 6 billion alert() functions!
    if (locoAddress != undefined) {
        //this if else if... statement checks if we're notching up, down, setting a notch as a number, or resetting the notching.
        //reset not implemented yet
        
        if (dowhat == "up") {
            //be sure notches stay within acceptable range
            if(notch < 8) {
                //notch the sound up, adjust the notch variable
                notch++
                sound_notch("up")
                updateNotchHTML(notch)
            }
        }
        else if (dowhat == "down") {
            //be sure notches stay within acceptable range
            if(notch > 0) {
                //notch the sound down, adjust the notch variable
                notch--
                sound_notch("down")
                updateNotchHTML(notch)
            }
        }
        
        //setnotch as number-STILL BEING DEVELOPED-DO NOT USE (however you are welcome to contribute to the source of this, it's giving me headaches as a bit of a JS newbie)
        else if (dowhat >= 0) {
            //this is a weird chain of if statements, but it sorts out bogus number requests
            //(obviously we can't do setNotch(42), so we have this lovely disorganized code
            if (dowhat <= 8) {
             //this is where the code runs to actually set the notch to a number
                
                //this figures out what we have to do to get to the notch we want (for example, 7-8 here means we need to decrease it by 1)
                notchChange = dowhat - notch
                //do we need to INCREASE it? or do we need to DECREASE it? lets find out
                if (notchChange > 0) {
                    //we need to increase it
                    notch = notch + notchChange
                }
                else if (notchChange < 0) {
                    notchChange = Math.abs(notchChange)
                    //we need to decrease it
                    notch = notch - notchChange
                    console.log("Need to decrease the notch by: " + notchChange)
                    
                    //2nd notch
                    if(notchChange != 0) {
                        setTimeout(sound_notch("down"), locoSoundNotchMinTime)
                    }
                    var locoSoundNotchMinTimeTMP = locoSoundNotchMinTime * 2
                    //3rd notch
                    if(notchChange != 0) {
                        setTimeout(sound_notch("down"), locoSoundNotchMinTimeTMP)
                    }
                    locoSoundNotchMinTimeTMP = locoSoundNotchMinTime * 3
                    //4th notch
                    if(notchChange != 0) {
                        setTimeout(sound_notch("down"), locoSoundNotchMinTimeTMP)
                    }
                    locoSoundNotchMinTimeTMP = locoSoundNotchMinTime * 4
                    //5th notch
                    if(notchChange != 0) {
                        setTimeout(sound_notch("down"), locoSoundNotchMinTimeTMP)
                    }
                    locoSoundNotchMinTimeTMP = locoSoundNotchMinTime * 5
                    //6th notch
                    if(notchChange != 0) {
                        setTimeout(sound_notch("down"), locoSoundNotchMinTimeTMP)
                    }
                    locoSoundNotchMinTimeTMP = locoSoundNotchMinTime * 6
                    //7th notch
                    if(notchChange != 0) {
                        setTimeout(sound_notch("down"), locoSoundNotchMinTimeTMP)
                    }
                    locoSoundNotchMinTimeTMP = locoSoundNotchMinTime * 7
                    //8th notch
                    if(notchChange != 0) {
                        setTimeout(sound_notch("down"), locoSoundNotchMinTimeTMP)
                    }
                    
                    
                    
                }
            }
        }
    }
    else {
        alert("You haven't requested a throttle yet! We can't send any commands to a locomotive until you...um...tell us which one...which you do by requesting a throttle... :P")
    }
return notch;
}
