//this contains high level locomotive functions, usually (at least mostly) decoder agnostic. These functions call functions from decoder.js in order to communicate with the locomotive

var actualDirection;
actualDirection = 0;


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



//hacky global variable definitions for tinkering
train = []
train.total = {weight:0, motiveForce:0, rollingResistance:0}
train.maxSpeeds = []
speedMPH = 0
train.leadLoco = undefined

function protoEngine_accel(ARGnotch, ARGreverser) {
    /*
        First we need to go through each element in the train and perform some calculations. The motive force, fuel use, and some other non-physics calculations are outsourced to other functions, so bear that in mind when reading the code.
        
        The for loop below is just to cycle through every item in the train.
        */
    for (i = 0; i < train.length; i++) {
        /*
            Now that we're going to parse each element in the train, including rolling stock AND locomotives, we need to split things up.
            
            Since we need to do different calculations for rolling stock than we do locomotives, we sort them out into their own if functions.
            */
        if(train[i].type == "locomotive") {
            /*
                All code to do with locomotives only will go here.
                
                Now that we know we're dealing with a locomotive, we can start the calculations. This function calculates all of the following things:
                - Motive Force (lbs)
                - Braking Force (as of 11/12/15 this is unfinished)
                
                The first lines here are for calculating tractive effort. The variables/arguments for the function that is used here is explained in the comments above the function.
                */
            var horsepower = train[i].prototype.outputHorsepower;
            var speed = train[i].prototype.speed;
            var efficiency = train[i].prototype.efficiency;
            var beginningSpeed = train[i].prototype.tractiveEffortEquationStart;
            var startingTE = train[i].prototype.startingTE
            train[i].prototype.TE = crunch.tractiveEffort(horsepower, speed, efficiency, beginningSpeed, startingTE);
                
            train[i].prototype.rollingResistance = crunch.rollingResistance(train[i].prototype.weight, train[i].prototype.coefficientOfRollingResistance)
                
            /*
                Now we must add the motiveForce and rollingResistance values we just found to the totals for the whole train. This physics engine is assuming no coupler slack for simplicity's sake; I would like to add slack later on but not right now.
                */
            train.total.motiveForce = train.total.motiveForce + train[i].prototype.TE;
            train.total.rollingResistance = train.total.rollingResistance + train[i].prototype.rollingResistance;
        }
    }
    
    speedMPH = 0
     
    /*
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
     
     Commented out for debugging purposes 11/12/15
     */
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


/*
The crunch object

The crunch object is actually a very simple way to handle things. I built this in to allow for easy addition of calculations without cluttering up code. If you know you're going to be calculating the same old thing over and over again (for example, rolling resistance) then it makes sense to tidy things up and use a function instead of littering the main physics engine function with loads of decimals and other variables.
*/
crunch = new Object();

/*
This function is quite simple. It is for calculating rolling resistance of a given body.

Call with:
crunch.rollingResistance(weight, coefficient)
Weight is the weight of the rolling thing in pounds, and coefficient is the dimensionless coefficient of rolling resistance.

The function will then return a rolling resistance value, in lbs.
*/
crunch.rollingResistance = function(weight, coefficient) {
    return (weight * coefficient)
}

/*
This function is rather involved, but simple to use. It is for calculating the tractive effort of a diesel locomotive at a given speed.

It is called like so:

crunch.tractiveEffort(horsepower, speed, efficiency, beginningSpeed, startingTE)

Arguments:
horsepower - the OUTPUT HORSEPOWER of the locomotive. This is dependent on the notch.
speed - the current speed of the locomotive IN MILES PER HOUR. IF YOU GIVE IT KM/HR IT WILL BE WRONG!
efficiency - the efficiency of the locomotive in converting power into torque, expressed as a decimal. For example, 75% efficiency would be 0.75
startingTE - the starting tractive effort in lbs
beginningSpeed - the speed to start using the equation to find TE. Until this speed, the function will simply report the starting TE.

The function will return a tractive effort value in POUNDS.

This function is built using an equation outlined in an engineering paper by Virginia Tech.
http://128.173.204.63/courses/cee3604/cee3604_pub/rail_resistance.pdf
Credit where credit is due; this paper is excellent.
*/
crunch.tractiveEffort = function(horsepower, speed, efficiency, beginningSpeed, startingTE) {
    //First we need to convert the speed to KM/HR.
    var speedSI = speed * 1.60934
    
    /*
    Now we must actually use the formula from the Virginia Tech paper. It states:
    T = 2650((np/v))
    
    T is tractive effort in Newtons.
    n is the efficiency coefficient (unitless)
    p is the output horsepower
    v is the speed in km/hr
    */
    var teNewtons = 2650 * ( (efficiency * horsepower)/(speedSI) )
    
    //Now that we have the tractive effort in Newtons, we must convert it to pounds.
    var teLbs = 0.224809 * teNewtons
    
    /*
    The tractive effort curve moves upward too sharply below a certain speed. This can vary by locomotive, so it is a configurable value in prototype objects. The following code is a safeguard to set the tractive effort to the starting TE if the speed is below the cutoff.
    */
    if (speed < beginningSpeed) {
        teLbs = startingTE;
    }
    
    //Since the tractive effort is converted to LBS now, we can return this value.
    return teLbs;
}



