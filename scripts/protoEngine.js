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
            if(notch < train[0].maxNotch) {
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
          setTimeout(function() {notchAllowed = true}, train[0].notchWait)
          setTimeout(function() {console.log("Notching allowed again!")}, train[0].notchWait)
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

//hacky global variable definitions for tinkering
train = []
train.total = {weight:0, maxHP:0, rollingResistance:0}
currentTrainElement = 0
speedMPH = 0

function protoEngine_accel(ARGnotch, ARGreverser) {
 if (locoAddress != undefined) {
     //rewrite on 9/18/15 to use the new JSON train notation
     train.total = {"maxHP":0}
     train.total.weight = 0 //reset just in case changes are made, we redo this frequently
     //parses train list and find out which ones are locomotives and which are cars
     for (i = 0; i < train.length; i++) {
         console.log("I is equal to " + i)
         currentTrainElement = i
         //we do this for each train car
         //adding this car's weight to the total train weight
         train.total.weight = train.total.weight + train[currentTrainElement].weight;
         console.log("train.totalmass Updated to " + train.total.weight)
         
         
         
         //trainwide max HP
         //parses each element on the train to see if it's a locomotive, if it is then it adds the max horsepower of it to the trainwide max HP value
         if (train[currentTrainElement].type == "locomotive") {
             train.total.maxHP = train.total.maxHP + train[currentTrainElement].maxHP
             console.log("Train's total maximum horsepower updated to: " + train.total.maxHP)
             train[currentTrainElement].outputEngineForce = (notch * train[currentTrainElement].maxHP * 550)
             train.total.outputEngineFore = train.total.outputEngineForce + train[currentTrainElement].outputEngineForce
             train[currentTrainElement].Fmax = train.coefficient.friction * train[currentTrainElement].weight
             if (train[currentTrainElement].Fmax < train[currentTrainElement].outputEngineForce) {
                 //if this locomotive's output force exceeds it's maximum value, then...
                 
             }
             
         }
         
         train.total.maxNotch = train[0].maxNotch //this sets the trainwide max notch based on lead locomotive max notch
         
         //end of train parsing function below here  
     }
     
     //rolling resistance of whole train, changed to the correct sign (+ or -) based on the direction the train is moving
         train.total.rollingResistance = actualDirection * (0.001 * train.total.weight)
     
     //motive force
     train.total.outputEngineForce = reverser * (((notch/train.total.maxNotch) * train.total.maxHP) * 550) //finds the output force of all the engines on the train
     console.log("Output Engine Horsepower = " + reverser * ((notch/train.total.maxNotch) * train.total.maxHP))
     console.log("Output Engine Force = " + train.total.outputEngineForce)
     
     //wind resistance junk
     wind = Math.abs(speedMPH)
     console.log("Wind = " + wind)
     if (actualDirection == 1) {
         train.total.windResistance = train[0].frontArea * ((wind^2) * 0.00256) //wind resistance for forward movement
         console.log("Wind Resistance = " + train.total.windResistance)
     }
     if (actualDirection == -1) {
         train.total.windResistance = -1 * (train[(train.length - 1)].rearArea * ((wind^2) * 0.00256)) //this seems goofy but it just finds the rear area of the last thing in the train
         console.log("Wind Resistance = " + train.total.windResistance)
     }
     if (actualDirection == 0) {
         train.total.windResistance = 0
         console.log("Wind Resistance = 0")
     }
     //end wind resistance
     
     
     console.log("Rolling Resistance = " + train.total.rollingResistance)
     
     //net force code
     netForce = train.total.outputEngineForce - (train.total.windResistance + train.total.rollingResistance)
     console.log("Net Force = " + netForce)
     
     acceleration = netForce / train.total.weight //this whole thing is a big f=ma problem
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


//functions dealing with the train
train = []
train.build = new Object();
train.ui = new Object();


train.build.add = function(type, number) {
    if (type == "locomotive") {
        //if the type of the item is a locomotive
        var item = prototype.locomotives[number];
        train.push(item);
        console.log("Added " + item + "to train object.");
        train.ui.update();
    }
    if (type == "rollingstock") {
        //if the type of the item is rolling stock
        var item = prototype.rollingstock[number];
        train.push(item);
        console.log("Added " + item + "to train object.");
        train.ui.update();
    }
}

train.ui.update = function() {
    var newHTML = ""
    var finalHTML = ""
    var finalArray = []
    
    //we go through each train element
    for (i = 0; i < train.length; i++) {
        if (train[i].imageURL == undefined) {
            newHTML = '<div class="chip">' + train[i].builder + " " + train[i].name + "<i class='material-icons close-chip-btn right'>close</i></div>"
            finalArray.push(newHTML) //append the newly built HTML for this element to the final product
        }
        if (train[i].imageURL != undefined) {
            newHTML = '<div class="chip"><img src="' + train[i].imageURL + '">' + train[i].builder + " " + train[i].name + "<i class='material-icons right close-chip-btn'>close</i></div>"
            finalArray.push(newHTML) //append the newly built HTML for this element to the final product
        }
    }
    
    finalHTML = finalArray.join(""); //join the array elements together into a single HTML string, using "" as a separator (nothing, as opposed to comma which is the default)
    
    document.getElementById("trainDisplay").innerHTML = finalHTML //set inner HTML of div element for displaying train
    
}

train.ui.buildPalette = function() {
    //FIRST LOCOMOTIVES
    var locos = new Object();
    locos.finalHTML = ""
    locos.finalArray = []
    locos.newHTML = ""
    
    //we go through each available locomotive from prototypes.json
    for (i = 0; i < prototype.locomotives.length; i++) {
        if (prototype.locomotives[i].imageURL == undefined) {
            locos.newHTML = '<div class="chip">' + prototype.locomotives[i].builder + " " + prototype.locomotives[i].name + '<i class="material-icons right" onclick="train.build.add(\'locomotive\',' + i + ')">add</i></div>';
            locos.finalArray.push(locos.newHTML); //append the newly built HTML for this element to the final product
        }
        if (prototype.locomotives[i].imageURL != undefined) {
            locos.newHTML = '<div class="chip"><img src="' + prototype.locomotives[i].imageURL + '">' + prototype.locomotives[i].builder + " " + prototype.locomotives[i].name + '<i class="material-icons right" onclick="train.build.add(\'locomotive\',' + i + ')" >add</i></div>';
            locos.finalArray.push(locos.newHTML); //append the newly built HTML for this element to the final product
        }
    }
    
    locos.finalHTML = locos.finalArray.join(""); //join the array elements together into a single HTML string, using "" as a separator (nothing, as opposed to comma which is the default)
    
    document.getElementById("locomotivePalette").innerHTML = locos.finalHTML
    console.log("Locomotive Palette Final HTML: " + locos.finalHTML)
    
    //Now locomotives is done
    //SECOND, ROLLING STOCK
    var rollingstock = new Object();
    rollingstock.finalHTML = ""
    rollingstock.finalArray = []
    rollingstock.newHTML = ""
    
    //we go through each available locomotive from prototypes.json
    for (i = 0; i < prototype.rollingstock.length; i++) {
        if (prototype.rollingstock[i].imageURL == undefined) {
            rollingstock.newHTML = '<div class="chip">' + prototype.rollingstock[i].name + '<i class="material-icons right">add</i></div>';
            rollingstock.finalArray.push(rollingstock.newHTML); //append the newly built HTML for this element to the final product
        }
        if (prototype.rollingstock[i].imageURL != undefined) {
            rollingstock.newHTML = '<div class="chip"><img src="' + prototype.rollingstock[i].imageURL + '">' + prototype.rollingstock[i].name + '<i class="material-icons right">add</i></div>';
            rollingstock.finalArray.push(rollingstock.newHTML); //append the newly built HTML for this element to the final product
        }
    }
    
    document.getElementById("rollingstockPalette").innerHTML = rollingstock.finalHTML
    
}