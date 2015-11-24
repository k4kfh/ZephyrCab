//this contains high level locomotive functions, usually (at least mostly) decoder agnostic. These functions call functions from decoder.js in order to communicate with the locomotive

var actualDirection;
actualDirection = 0;


/*
Notching Objects

notch is the top level object for all this, and it contains "state" and "set()" which are pretty self explanatory
*/
notch = new Object();
notch.state = 0 //Notch defaults to 0, which is idling.
notch.set = function(newNotch) {
    //First, we need to check and make sure we're not adjusting the notch by more than 1.
    var differenceInNotch = Math.abs(notch.state - newNotch)
    if (differenceInNotch == 1) {
        //The user is only moving the notch 1 click, so we can continue with setting it
        notch.state = newNotch;
        
        //and finally we return the new notch
        return notch.state;
    }
    else {
        //User is trying to move the notch by more than 1 click, which can't happen. We simply return the existing notch, which causes the slider to move back, and notify them.
        Materialize.toast("<i class='material-icons left'>error</i>You can't adjust the notch by more than 1 click at a time!", 5000)
        return notch.state;
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

/*

*/
crunch.wheelSlip = function(mass, load, coeffStatic, coeffKinetic, coeffSand, currentSlip) {
    var cube = new Object();
    //First we choose either the coefficient of kinetic friction or the coefficient of static friction, based on whether or not the wheel is already slipping.
    var coefficient
    if (currentSlip != 0) {
        coefficient = coeffKinetic;
    }
    else {
        coefficient = coeffStatic;
    }
    
    var threshold = mass * coefficient;
    
    if (load > threshold) {
        slipping = true;
        coefficient = coeffKinetic
        threshold = mass * coefficient;
        cube.netForce = load - threshold
        cube.acceleration = cube.netForce / mass //this is in feet per second
        cube.newSpeed = currentSlip + cube.acceleration
    }
    if (load <= threshold) {
        slipping = false;
    }
    
    console.log(cube)
    return slipping;
}

wheel = function(trainNumber, mass, radius) {
    this.slip = new Object();
    this.slip.current = 0;
    this.slip.calc = function(load) {
        var threshold = mass * load;
        if (load > threshold) {
            var slipping = true;
        }
        else {
            var slipping = false;
        }
    }
}



