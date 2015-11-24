/*
Notching Objects

notch is the top level object for all this, and it contains "state" and "set()" which are pretty self explanatory

set() is called with a number as it's only argument. If a user tries to raise the notch by more than one, then the function will return the existing notch. The function will always return the actual notch.
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

sim = new Object();

sim.accel = function() {
    //This FOR loop goes through every train element. If there are none, it just does nothing.
    for(i = 0; i < train.all.length; i++) {
        //First, we need to find out what type of element we're dealing with.
        if (train.all[i].prototype.type == "locomotive") {
            //We are dealing with a locomotive.
            
            //First thing we need to do is deal with engine RPM and notching.
            //From there, we'll calculate fuel stuff, and then deal with tractive effort.
            
            train.all[i].prototype.realtime.rpm = train.all[i].prototype.notchRPM[notch.state] //This uses the notch (global variable) to lookup the rpm in an array of RPMs by notches.
            
            //TODO - Fuel stuff
            
            /*
            Now we can calculate tractive effort based on notch and speed. This is done using a function (left open to developers of prototype objects) from inside the train object's prototype subobject.
            */
            var elementSpeed = train.all[i].prototype.realtime.speed
            var trainPosition = i; //This is passed as an argument so the function can see ALL of its parent object's attributes
            var te = train.all[i].prototype.calc.te(elementSpeed, trainPosition)
            train.all[i].prototype.realtime.te = te; //Store TE in the train object
            
        }
        else if (train.all[i].prototype.type == "rollingstock") {
            //We are dealing with rolling stock.
            
        }
    }
}


/*
The crunch object

The crunch object is actually a very simple way to handle things. It's basically a collection of reusable "canned" math functions. I built this in to allow for easy addition of calculations without cluttering up code. If you know you're going to be calculating the same old thing over and over again (for example, rolling resistance) then it makes sense to tidy things up and use a function instead of littering the main physics engine function with loads of decimals and other variables.
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

//Once ALL this is loaded, we start the calculation loop, which runs every 100ms.
sim.recalcInterval = setInterval(function() {sim.accel()}, 100)



