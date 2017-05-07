//This is a really ugly temporary file to hold a quick rough draft of a new sim.accel function
sim = {};

/*
Notching Objects

notch is the top level object for all this, and it contains "state" and "set()" which are pretty self explanatory

set() is called with a number as it's only argument. If a user tries to raise the notch by more than one, then the function will return the existing notch. The function will always return the actual notch.
*/
notch = new Object();
notch.state = 0 //Notch defaults to 0, which is idling.
notch.set = function(newNotch) {
    //This function used to limit notch changes to 1 click at a time, but that got to be cumbersome on a touch screen. So it's basically a dummy function now, I just would rather have the abstraction layer for notch.state leftover if I decide I need it for something. Because ain't nobody got time to do massive codebase changes.
    notch.state = newNotch;
    return notch.state;
}

//We also go ahead and define the reverser so the math works
reverser = 0; //NEUTRAL not FWD

sim = new Object();
sim.direction = 1 //1 means forward, -1 means reverse, 0 means we're currently stopped. This is the ACTUAL direction, which is not necessarily the reverser's direction.
sim.time = {
    speed: 1,
}

//We need to go ahead and define all the stuff inside train.total and set it to 0
train.total = new Object();
train.total = {
    netForce: 0,
    weight: 0,
    accel: {
        si: {
            force: 0,
            mass: 0,
            acceleration: 0
        },
        acceleration_mph: 0,
        speed: {
            mph: 0,
            ms: 0,
        }
    }
}

sim.accel = function() {
    //make sure the train actually has elements
    if (train.all.length !== 0) {

        //We have to clear these variables on start, otherwise the train will progressively get heavier as we walk the array a few times. We do this the ugly way instead of the json way because doing it the json way also resets the speed to zero.
        train.total.netForce = 0;
        train.total.weight = 0;
        train.total.accel.si.force = 0;
        train.total.accel.si.mass = 0;
        train.total.accel.si.acceleration = 0;
        train.total.accel.acceleration_mph = 0;

        //Now we increment over every train object
        for (var i = 0; i < train.all.length; i++) {

            if (train.all[i].type == 'locomotive') {
                //Locomotive Specific Stuff

                /*
                If the engine is running:
                - Calculate RPM and tractive effort
                - Figure out notching sounds on applicable decoders
                - Start or stop the air compressor depending on reservoir pressure

                If the engine is not running (the else statement):
                - Set RPM and Tractive Effort to 0
                - Don't do anything with notching sounds
                - Stop the air compressor
                */
                if (train.all[i].prototype.engineRunning === 1) {
                    //Calculates the engine RPM, which is necessary for compressor flow rate
                    train.all[i].prototype.realtime.rpm = train.all[i].prototype.engineRunning * train.all[i].prototype.notchRPM[notch.state];
                    //SETTING NOTCHING SOUNDS
                    if (train.all[i].dcc.f.notch.state != notch.state) {
                        //console.debug("TRIGGERED")
                        //We know it's changed, now we have to figure out which direction (up or down) to move it.
                        var difference = notch.state - train.all[i].dcc.f.notch.state; //This will equal 1 or -1, telling us the    direction to notch
                        //console.log("Difference in notch: " + difference)
                        if (difference == 1) {
                            train.all[i].dcc.f.notch.up();
                        } else if (difference == -1) {
                            train.all[i].dcc.f.notch.down();
                        }
                    } else {
                        //console.log("No notch difference found")
                    }

                    //call the tractive effort calculation function of the locomotive's bundle
                    train.all[i].prototype.realtime.te = train.all[i].prototype.calc.te(train.total.accel.speed.mph, i);

                    /*
                    ROLLING RESISTANCE AND GENERAL DRAG

                    This is where rolling resistance, along with a general drag coefficient (WIP!) to account for bearings and the like, is calculated.
                    */
                    train.all[i].prototype.realtime.rollingResistance = sim.direction * -1 * train.all[i].prototype.coeff.rollingResistance * train.all[i].prototype.weight
                        //This IF statement makes sure we dont accidentally have it pull the train backwards if it's sitting still.
                    if (train.total.accel.speed.mph == 0) {
                        train.all[i].prototype.realtime.rollingResistance = 0
                    }

                    /*
                    COMPRESSOR AND AIR RESERVOIR(S)

                    This is calculated using an algebraically twisted version of Boyle's law. We basically find how much volume (at atmosphere pressure) has been crammed into a fixed space, so instead of decreasing volume and keeping mass of air the same, we are increasing mass of air and keeping tank volume constant.

                    Steps:
                    1. See if dump valve is open
                    2. Turn compressor on or off based on current pressure
                    3. Find compressor output flow rate (in cubic feet per physics cycle).
                    4. Find volume of atmosphere-pressure air that is in the tank.
                    5. Account for the steady leak rate specified in the prototype file.

                    More information on all this to come.
                    */
                    //Define some shorthand variables for readability
                    var compressor = train.all[i].prototype.air.compressor,
                        dumpValve = train.all[i].prototype.air.reservoir.main.dump,
                        upperLimit = train.all[i].prototype.air.compressor.limits.upper,
                        lowerLimit = train.all[i].prototype.air.compressor.limits.lower,
                        psi = train.all[i].prototype.air.reservoir.main.psi.g,
                        cfmRpmRatio = train.all[i].prototype.air.compressor.flowrateCoeff, //ratio of cfm per rpm
                        rpm = train.all[i].prototype.realtime.rpm;
                    /*
                    IF/ELSE Tasks
                    1. See if dump valve is open
                    2. Turn compressor on or off based on current pressure
                    */
                    if (dumpValve == false) {
                        //If pressure is too low, start compressor
                        if (psi < lowerLimit) {
                            //Turn on compressor
                            compressor.running = 1;
                            train.all[i].dcc.f.compressor.set(true);
                        }
                        //If pressure is too high, stop compressor
                        else if (psi > upperLimit) {
                            //Turn off compressor
                            compressor.running = 0;
                            train.all[i].dcc.f.compressor.set(false);
                            //Set flow rate to 0cfm

                        }
                    }
                    //If dump valve is open, make sure compressor is off
                    else {
                        compressor.running = 0; //we set this variable for the functions in air.js to use
                    }

                    /*
                    TASKS
                    3. Find compressor output flow rate (in cubic feet per physics cycle).
                    */
                    var flowratePerCycle = (rpm * cfmRpmRatio) / 600; //we divide this by 600 to change it from cubic feet per minute to cubic feet per 100ms (since sim.js recalculates every 100ms). Store this locally only since we won't need it again

                    //Add flowrate (in cubic feet per cycle) to the airVolumeInTank variable.
                    //This huge long statement really just says (currentAtmAirVolume = currentAtmAirVolume + flowratePerCycle)
                    train.all[i].prototype.air.reservoir.main.currentAtmAirVolume = train.all[i].prototype.air.reservoir.main.currentAtmAirVolume + flowratePerCycle;

                    //Subtract leak rate in cubic feet before calculating pressure
                    var volumeInTank = train.all[i].prototype.air.reservoir.main.currentAtmAirVolume;
                    var leakRate = train.all[i].prototype.air.reservoir.main.leakRate; //this is loss in cubic feet per cycle
                    //The business end of this messy code here
                    var volumeInTank = volumeInTank - leakRate;
                    //More jostling variables around
                    train.all[i].prototype.air.reservoir.main.currentAtmAirVolume = volumeInTank;

                    //Make sure the volume isn't below the capacity of the reservoir (otherwise we'll have a vacuum)
                    if (train.all[i].prototype.air.reservoir.main.currentAtmAirVolume < train.all[i].prototype.air.reservoir.main.capacity) {
                        //if the volume is less than the minimum (the capacity) then fix it
                        train.all[i].prototype.air.reservoir.main.airVolumeInTank = train.all[i].prototype.air.reservoir.main.capacity;
                    }
                    air.reservoir.main.updatePSI(i) //this takes all those numbers we just figured out and calculates the PSI, then updates the gauge
                } else {
                    /*
                    If the engine is NOT running:
                    - Set RPM and Tractive Effort to 0
                    - Don't do anything with notching sounds
                    - Set fuel consumption to 0
                    - Stop the air compressor
                    - Still find the PSI of the main reservoir and the brake cylinder and whatnot
                    */
                    train.all[i].prototype.realtime.rpm = 0;
                    train.all[i].prototype.realtime.te = 0;
                    //Turn off air compressor sound
                    train.all[i].dcc.f.compressor.set(false);
                    //Turn off air compressor simulation
                    train.all[i].prototype.air.compressor.running = 0;
                    //update PSI for main reservoir based on the numbers we have, just so the number is still there
                    air.reservoir.main.updatePSI(i)
                }

                //BRAKES


                /*Locomotive-Only Totaling Math
                Steps:
                1. Add weight to total weight
                2. Add tractive effort to total net force
                3. Add braking force to total braking force (TODO)
                */
                train.total.weight = train.total.weight + train.all[i].prototype.weight; //weight = weight + element.weight
                train.total.netForce = train.total.netForce + train.all[i].prototype.realtime.te + train.all[i].prototype.realtime.rollingResistance;

            }
            if (train.all[i].type == "rollingstock") {
                //Rolling Stock Specific Stuff

                //Automatic Brake system
                //Because of the responsiveness needed for this brake system to be realistic, every one rolling stock cycle will go through the entire train's brake system
                for (var car = 0; car < train.all.length; car++) {
                    brake.cycle(car);
                }
                //find the brake force for the one car we're dealing with here
                var brakeForce = train.all[i].prototype.brake.brakingForce * sim.direction;
                
                //Find rolling resistance
                var rollingResistance = train.all[i].prototype.coeff.rollingResistance * train.all[i].prototype.weight * -1 * sim.direction; //multiply by -1 since it's backwards force
                if (train.total.accel.speed.mph == 0) {
                    train.all[i].prototype.realtime.rollingResistance = 0;
                }
                train.all[i].prototype.realtime.rollingResistance = rollingResistance;

                //Net Force
                var netForce = brakeForce + rollingResistance;
                if (train.total.accel.speed.mph == 0) {
                    netForce = 0;
                }
                train.all[i].prototype.realtime.netForce = netForce;

                //add net force to total
                train.total.netForce = train.total.netForce + train.all[i].prototype.realtime.netForce;
                
                //also ensure we're factoring in this car's weight
                train.total.weight = train.total.weight + train.all[i].prototype.weight; //weight = weight + element.weight
            }

            //convert mass from pounds to kg
            train.total.accel.si.mass = train.total.weight * 0.453592;
            //convert netForce from pounds to Newtons
            train.total.accel.si.force = train.total.netForce * 4.44822;

            //Final Net force/speed calculations
            //Defining shorthand variables for clarity
            var netForce = train.total.accel.si.force;
            var mass = train.total.accel.si.mass;

            //leveraging f=ma to find acceleration, in meters per second per second
            train.total.accel.si.acceleration = netForce / mass;
            //first we compute the new speed in meters per second
            train.total.accel.speed.ms = train.total.accel.speed.ms + train.total.accel.si.acceleration;

            //we store the acceleration in mph per second
            train.total.accel.acceleration_mph = train.total.accel.si.acceleration * 2.23694; //convert from m/s/s to mph/s

            //now figure out how much speed to add/subtract by converting that acceleration to miles per hour per sim.time
            var accelerationPerCycle = train.total.accel.acceleration_mph * (sim.time.interval / 1000);
            //Forced zero crossing code (keeps the train from going back and forth when it should just stop)
            if (train.total.accel.speed.mph > 0 && train.total.accel.speed.mph + accelerationPerCycle < 0) {
                //if we're going from positive to negative
                train.total.accel.speed.mph = 0;
                console.log("SIM DIRECTION = " + sim.direction)
                console.dir(train)
                console.info('ZERO CROSSING! (from positive side)')
                sim.direction = 0;
            } else if (train.total.accel.speed.mph < 0 && train.total.accel.speed.mph + accelerationPerCycle > 0) {
                //if we're going from negative to positive
                train.total.accel.speed.mph = 0;
                console.log("SIM DIRECTION = " + sim.direction)
                console.dir(train)
                console.info('ZERO CROSSING! (from negative side)')
                sim.direction = 0;
            }
            else { //if we're not going to cross 0, just handle acceleration like normal
                train.total.accel.speed.mph = train.total.accel.speed.mph + accelerationPerCycle;
            }
            gauge.speedometer(Math.abs(train.total.accel.speed.mph)); //abs in case we're going backwards and it's negative
            //also set the sim.direction (actual direction) variable
            if (train.total.accel.speed.mph == 0) {
                sim.direction = 0;
            }
            else if (train.total.accel.speed.mph > 0) {
                sim.direction = 1;
            }
            else if (train.total.accel.speed.mph < 0) {
                sim.direction = -1;
            }

            //Finally we actually make the locomotive(s) go this speed
            for (var x = 0; x < train.all.length; x++) {
                //walk over each train element and ignore rolling stock
                if (train.all[x].type == "locomotive") {
                    //set direction first
                    train.all[x].throttle.direction.set(sim.direction);
                    train.all[x].dcc.speed.setMPH(Math.abs(train.total.accel.speed.mph)); //we use ABS here because the direction is set separately from the actual speed
                }
            }
        }
    }
}


//SIM INTERVAL STUFF
sim.stop = function() { //stops the sim by clearing the interval
    clearInterval(sim.recalcInterval);
}

sim.start = function(timing) {
    if (timing == undefined) {
        timing = sim.time.interval; //if the user doesn't specify, we use the last one we used
    }
    sim.recalcInterval = setInterval(function() {
        sim.accel()
    }, timing);
    sim.time.interval = timing; //store this for later
}

sim.start(100); //runs the sim every 100ms by default
