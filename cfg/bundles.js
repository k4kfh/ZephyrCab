/*
BUNDLES

This file is rather special. It bundles locomotive prototype entries and model entries to an entry in the JMRI roster.

It is done using objects, but the syntax is very specific. You must adhere to this syntax or things will explode in fiery infernos.
*/
bundles = new Object();

//Locomotives - ARE currently tied to the JMRI roster - Please make sure your syntax is correct, and that the names of your entries match the JMRI roster entry names TO THE LETTER! It is case sensitive as well.
bundles.locomotives = {
    /*
    Example entry for my Athearn Genesis GP15-1 is shown below
    
    "GP15-1 #1379":{
        model:{
            speed:function(mph) {} this is a function that returns a speed in percent from a speed in mph. it is model-specific due to gearing.
        },
        
        prototype:"EMD GP15-1"
    }
    
    The decoder settings are not here because we can grab those straight from JMRI.
    */
    "CBQ2": {
        type: "locomotive",
        model: //all functions dealing with virtual-->model physics
        {
            speed: function(mph) {
                    //this number is specific to a Bachmann FT-A with a LokSound decoder installed. I derived it from tests with a scale speedometer.
                    var speedSteps = mph / 0.7261
                    return (speedSteps / 126);
                } //converts speed in mph to JMRI speed %
        },
        prototype: {
            "builder": "EMD",
            "name": "F7-A",
            "weight": 250000, //Weight of the locomotive in lbs
            "maxHP": 1500, //Horsepower of the locomotive
            "maxAmps": 900, //Max current of the locomotive
            "notchRPM": [300, 362, 425, 487, 550, 613, 675, 738, 800],
            "notchMaxSpeeds": [null, 7.5, 15, 22.5, 30, 37.5, 45, 52.5, 60],
            "engineRunning": 0, //0 or 1 - 1 is on, 0 is off
            "startingTE": 56500,
            fuel: {
                usage: [3.5, 6.5, 14.5, 23.4, 33.3, 45.7, 59.6, 75.3, 93.1], //array in gal/hr, by notch
                capacity: 1200, //fuel tank in GAL
                status: 1200, //updated fuel status
            },

            calc: //this contains functions left open to developers to implement for a given locomotive
            {
                te: function(speed, trainPosition, overrideMaxSpeedForAmperage) {
                    /*
                                        This example uses an equation from a Virginia Tech paper.
                                        
                                        It is important to note that the value from this function will be used, unaltered, in the physics engine. You cannot forget to take into account the reverser. This is easy; all you have to do is multiply your calculated value by the global variable: reverser . If we're in neutral, this will yield 0. In forward, it will do nothing. In reverse, it will make your number negative. Simple, but very important.
                                        */
                    if (overrideMaxSpeedForAmperage == undefined) { //this option will not send a TE of 0 even if we're exceeding the maximum speed
                        overrideMaxSpeedForAmperage = false;
                    }
                    //First we need to convert the speed to KM/HR.
                    var efficiency = 0.72
                    var horsepower = train.all[trainPosition].prototype.maxHP * (notch.state / 8)
                    train.all[trainPosition].prototype.realtime.horsepower = horsepower; //just so it's stored
                    var speedSI = speed * 1.60934

                    /*
                    Now we must actually use the formula from the Virginia Tech paper. It states:
                    T = 2650((np/v))
    
                    T is tractive effort in Newtons.
                    n is the efficiency coefficient (unitless)
                    p is the output horsepower
                    v is the speed in km/hr
                    */
                    var teNewtons = 2650 * ((efficiency * horsepower) / (speedSI))

                    //Now that we have the tractive effort in Newtons, we must convert it to pounds. We also include the exceedingMaxSpeed variable, which becomes 0 when we exceed the maximum electrically possible speed for a given notch, and thus makes the TE zero
                    train.all[trainPosition].prototype.calc.maxSpeed(trainPosition);
                    var teLbs = 0.224809 * teNewtons * reverser * train.all[trainPosition].prototype.realtime.exceedingMaxSpeed;
                    if (overrideMaxSpeedForAmperage) { //the amperage calculator uses this option to get an unmodified raw TE value
                        var teLbs = 0.224809 * teNewtons
                    }
                    //This is a measure of protection since the equation creates a curve that moves upwards too sharply
                    if (speed < 8.9 && overrideMaxSpeedForAmperage !== true) {
                        teLbs = 56500 * (notch.state / 8) * reverser * train.all[trainPosition].prototype.realtime.exceedingMaxSpeed;
                    } else if (speed < 8.9 && overrideMaxSpeedForAmperage) {
                        teLbs = 56500 * (notch.state / 8)
                    }
                    

                    return teLbs; //the abs is to protect against returning -0, //returns tractive effort in lbs
                },
                maxSpeed: function(trainPosition) {
                    var speedPerNotch = 7.5; //I chose to make my function a simple linear calculation
                    var maxSpeed = speedPerNotch * notch.state;
                    //This is a simple linear calculation that seemed 'good enough' to me, but if you find actual numbers you could create a better way.
                    var actualSpeed = Math.abs(train.total.accel.speed.mph) //TODO: Once coupler slack is implemented, this must change to the individual element's speed
                    log.sim("Actual Speed: " + actualSpeed)
                    if (actualSpeed > maxSpeed) {
                        //if we're exceeding it
                        train.all[trainPosition].prototype.realtime.exceedingMaxSpeed = 0;
                    } else {
                        //if all is well
                        train.all[trainPosition].prototype.realtime.exceedingMaxSpeed = 1; //this is an inverted boolean, see sim.js's math for the reason why
                    }
                }, //sets exceedingMaxSpeed (a coefficient to nullify TE) to 0 if we're exceeding traction motor's speed capabilities
                amps: function(trainPosition) {
                    var maxAmps = train.all[trainPosition].prototype.maxAmps;
                    var maxTE = train.all[trainPosition].prototype.startingTE;
                    var speed = train.total.accel.speed.mph;
                    var currentTE = train.all[trainPosition].prototype.calc.te(speed, trainPosition, true); //calls this with override option
                    train.all[trainPosition].prototype.realtime.amps = (currentTE / maxTE) * maxAmps;
                }
            },

            wheelSlip: { //this contains all the wheel slip functions and calculations. ultimately the TE calculator will draw from this, and so will the brakes (no braking effort if wheels are slipping)
                internalForces: 0,
                externalForces: 0,
                adhesion: 0.30, //adhesion factor (in percent)
                adhesionDuringSlip: 0.25, //adhesion factor for slipping wheels
                slipping: false,
                calcInternalForces: function(trainPosition) {
                    //add up TE and locomotive brakes
                    train.all[trainPosition].prototype.wheelSlip.internalForces = train.all[trainPosition].prototype.realtime.teIgnoreSlip + train.all[trainPosition].prototype.brake.brakingForce; //store em in a variable and return it too
                    return train.all[trainPosition].prototype.wheelSlip.internalForces;
                },
                calcExternalForces: function(trainPosition) {
                    //this is a shorter, more efficient way to add up all the net forces of every element in the train EXCEPT this one
                    var extForces = Math.abs(train.total.netForce - train.all[trainPosition].prototype.realtime.netForceIgnoreSlip);
                    log.Sim.wheelslip("Local Net Force = " + train.all[trainPosition].prototype.realtime.netForceIgnoreSlip)
                    train.all[trainPosition].prototype.wheelSlip.externalForces = extForces;
                    return extForces;
                },
                slipCalc: function(trainPosition) {
                    var el = train.all[trainPosition].prototype;
                    var threshold; //go ahead and define this for scope purposes
                    //if we're already slipping
                    if (el.wheelSlip.slipping) {
                        threshold = el.weight * el.wheelSlip.adhesionDuringSlip; //lower threshold once we start slipping
                    } else { //if we're not slipping already
                        threshold = el.weight * el.wheelSlip.adhesion; //normal threshold
                    }
                    log.Sim.wheelslip("---------")
                    log.Sim.wheelslip("Threshold = " + threshold);
                    
                    var loadOnWheels = el.wheelSlip.calcInternalForces(trainPosition) + el.wheelSlip.calcExternalForces(trainPosition); 
                    //calculate the load on the wheels
                    log.Sim.wheelslip("Load on wheels = " + loadOnWheels)
                    log.Sim.wheelslip("Internal Forces = " + el.wheelSlip.calcInternalForces(trainPosition))
                    log.Sim.wheelslip("External Forces = " + el.wheelSlip.calcExternalForces(trainPosition))
                    if (loadOnWheels >= threshold) {
                        el.wheelSlip.slipping = true;
                    } else {
                        el.wheelSlip.slipping = false;
                    }
                    log.Sim.wheelslip("Slipping = " + el.wheelSlip.slipping)
                    return el.wheelSlip.slipping;
                }
            },

            air: //holds static and realtime data about pneumatics
            {
                reservoir: {
                    main: {
                        capacity: 46.7882, //capacity of the tank in cubic feet
                        leakRate: 0, //leak rate in cubic feet per 100ms
                        currentAtmAirVolume: 6316.307,
                        psi: {
                            g: 0, //gauge psi, 0 means 1atm of pressure
                            abs: 14.696, //absolute psi
                        },
                    },
                },
                compressor: {
                    //STATIC DATA
                    limits: {
                        lower: 130, //This is the point at which the compressor will turn back on and fill up the air reservoir (psi)
                        upper: 140, //This is the point at which the compressor will turn off (psi)
                    },
                    flowrateCoeff: 0.28, //This is cfm/rpm, derived from "255cfm @ 900rpm for an SD45" according to Mr. Al Krug
                    //REALTIME DATA
                    running: 0, //set to 0 when it's off, 1 when it's on
                    //METHODS
                    calcFlow: function(trainPosition) { //return compressor CFM
                        /*
                        This function should calculate and set the flow rate in CFM. You can find out any prototype property since we gave it the trainPosition. You should NOT multiply this calculation by running or engineRunning; sim.js will do that!
                        In an F7, the compressor is driven directly by the prime mover, so this calculation will look at RPM and go from there.
                        */
                        var rpm = train.all[trainPosition].prototype.realtime.rpm
                        var cfm = rpm * 0.283; //This is a figure that I got from "255cu ft/min @ 900rpm" from Al Krug.

                        return cfm;
                    },
                },
            },

            "realtime": {
                netForceIgnoreSlip: 0, //this is a pseudo-value before slip factors in
                netForce: 0, //defined to make it work later
                speed: 0, //This is defined just to be safe.
                rollingResistance: 0, //this is pretty much a constant but we keep it here just cause
                exceedingMaxSpeed: 1, //This is a boolean stored as a number by .prototype.calc.maxSpeed . If the locomotive has reached its max speed, this becomes zero to nullify the tractive effort. If not, it remains 1.
                horsepower: 0, //This is the OUTPUT HP
                te:0,
                teIgnoreSlip:0, //this will still register a value despite slipping
            },

            "coeff": {
                rollingResistance: 0.0015,
            },

            brake: {
                //we separate the independent brake info
                ind: {
                    //return effective brake force (linear force at the wheels) and cylinder pressure as an object, plus set them in the train object
                    calcForce: function(trainPosition, refPSI) {
                        train.all[trainPosition].prototype.brake.cylinderPSI = indBrake.effectiveIndPSI; //this is dependent on your locomotive's relay valve
                        //if we're sitting still...
                        if (train.total.accel.speed.mph == 0) {
                            train.all[trainPosition].prototype.brake.brakingForce = 0;
                            return 0;
                        }
                        //calculate this your own way, developers, this math is highly debatable
                        train.all[trainPosition].prototype.brake.brakingForce = indBrake.effectiveIndPSI * 350 * -1 * sim.direction; //the crude "magic number" linear method
                        return train.all[trainPosition].prototype.brake.brakingForce;
                    }
                },
                //air brake equipment information
                latency: 100, //time it takes to propagate a signal through the car, in milliseconds
                //makes a brake reduction on ``trainPosition`` by ``psi``, and calculates the braking force resulting
                reservoirPSI: 90, //reservoir psi
                cylinderPSI: 0, //brake cylinder psi
                linePSI: 90, //brake pipe psi
            },
        },
    },

}

//Rolling Stock - NOT currently tied to the JMRI Roster
bundles.rollingstock = {
    "Generic Boxcar": {
        /*
        This is rather misleading. As of 3/16/16, there is ZERO integration with the JMRI roster for rolling stock.
        
        This object only has such a misleading naming convention to maintain backwards compatibility with some train.build stuff. If we specify the name inside .roster.name, it eliminates the need for a cumbersome if statement to deal with naming in train.ui HTML generation. It just works.
        
        In the future, integration with JMRI's OperationsPro is planned, and will likely make use of .roster to contain its information for a specific car.
        */
        roster: {
            name: "Generic Boxcar"
        },
        type: "rollingstock",
        prototype: {
            axles: 4,
            weight: 150000,
            realtime: {
                //realtime data for things like braking and coupler slack goes in here
                rollingResistance: 0,
                netForce: 0,
                netForceBeforeSlip: 0,
            },
            brake: {
                //air brake equipment information
                latency: 100, //time it takes to propagate a signal through the car, in milliseconds
                //makes a brake reduction on ``trainPosition`` by ``psi``, and calculates the braking force resulting
                reduction: function(trainPosition, psi) {
                    //exit the function before doing anything if we already have a $.animate() routine running for this car
                    if (train.all[trainPosition].prototype.brake.waitingOnApplication == true) {
                        return undefined;
                    }
                    //find the full service reduction, then make sure we can actually make the reduction
                    var EQpressure = brake.findEQpressure(brake.feedValvePSI).EQpressure;
                    var fullService = brake.findEQpressure(brake.feedValvePSI).fullServiceReduction
                    var resultingReservoirPSI = train.all[trainPosition].prototype.brake.reservoirPSI - psi;
                    if (resultingReservoirPSI <= EQpressure) {
                        psi = fullService; //we can't go any further than this no matter how much the train pipe is reduced
                    }

                    //Now we can actually perform the reduction
                    resultingReservoirPSI = train.all[trainPosition].prototype.brake.reservoirPSI - psi; //recompute this in case psi was just redefined
                    var resultingCylinderPSI; //define this here to get it in the right scope
                    if (psi == fullService) { //to make sure there are no issues due to rounding
                        resultingCylinderPSI = EQpressure;
                    } else {
                        resultingCylinderPSI = train.all[trainPosition].prototype.brake.cylinderPSI + (psi * 2.5);
                        //cylinder is 2.5x smaller than the reservoir, which is where the *2.5 comes from
                        //we add it to the existing PSI so that you can make multiple reductions in a row
                    }

                    //now if we've already made a full service reduction, we can just exit.
                    if (resultingCylinderPSI == train.all[trainPosition].prototype.brake.cylinderPSI) {
                        train.all[trainPosition].prototype.brake.tripleValveCycle(trainPosition);
                        return undefined; //stop the function
                    }

                    //Code for gradual application
                    //TODO - temporarily using setTimeout
                    var timeToWait = 1000 * (psi / train.all[trainPosition].prototype.brake.applicationRate);
                    log.Sim.brakes("Application will take " + timeToWait + "ms")
                    train.all[trainPosition].prototype.brake.waitingOnApplication = true;
                    $({
                        n: train.all[trainPosition].prototype.brake.cylinderPSI
                    }).animate({
                        n: resultingCylinderPSI
                    }, {
                        duration: timeToWait,
                        step: function(now, fx) {
                            train.all[trainPosition].prototype.brake.cylinderPSI = now;
                            //console.debug("BRAKE CYLINDER @" + trainPosition + "$.animate : " + now)
                            //find braking force resulting from this pressure
                            train.all[trainPosition].prototype.brake.calcForce(trainPosition, now);
                            //console.debug("BRAKING FORCE @" + trainPosition + " : " + train.all[trainPosition].prototype.brake.brakingForce)
                        },
                        complete: function() {
                            train.all[trainPosition].prototype.brake.waitingOnApplication = false;
                            //set the new reservoir PSI
                            train.all[trainPosition].prototype.brake.reservoirPSI = resultingReservoirPSI;
                            train.all[trainPosition].prototype.brake.tripleValveCycle(trainPosition);
                        }
                    });
                },
                //this takes no arguments since North American freight air brakes won't gradually release
                release: function(trainPosition) {
                    train.all[trainPosition].prototype.brake.cylinderPSI = 0; //release the cylinder pressure in the car
                    train.all[trainPosition].prototype.brake.calcForce(trainPosition, 0); //set car's brake force to zero
                    var chargeInterval = setInterval( //start the slow charging process for the car's reservoir
                        function() {
                            if (train.all[trainPosition].prototype.brake.reservoirPSI >= train.all[trainPosition].prototype.brake.linePSI) {
                                clearInterval(chargeInterval);
                                train.all[trainPosition].prototype.brake.reservoirPSI = train.all[trainPosition].prototype.brake.linePSI;
                                train.all[trainPosition].prototype.brake.tripleValveCycle(trainPosition);
                                log.Sim.brakes("ELEMENT " + trainPosition + " FINISHED RELEASING; RESERVOIR PRESSURE = " + train.all[trainPosition].prototype.brake.reservoirPSI)
                                return undefined; //break out of the function here
                            }
                            //gradually increase the brake pressure
                            train.all[trainPosition].prototype.brake.reservoirPSI = train.all[trainPosition].prototype.brake.reservoirPSI + (train.all[trainPosition].prototype.brake.chargeRate * 100);
                            log.Sim.brakes("ELEMENT #" + trainPosition + " NEW RESERVOIR PRESSURE = " + train.all[trainPosition].prototype.brake.reservoirPSI)

                        }, 100);
                },
                tripleValveCycle: function(trainPosition) {
                    var reservoirPSI = train.all[trainPosition].prototype.brake.reservoirPSI;
                    var linePSI = train.all[trainPosition].prototype.brake.linePSI;
                    if (reservoirPSI > linePSI) {
                        //triple valve APPLY
                        log.Sim.brakes("Element " + trainPosition + ": Triple Valve APPLY")
                        toast.brakeNotification("Applying brakes on #" + trainPosition);
                        train.all[trainPosition].prototype.brake.tripleValve = "A";
                        //Figure out how much of a reduction is needed
                        var reductionAmount = reservoirPSI - linePSI;
                        train.all[trainPosition].prototype.brake.reduction(trainPosition, reductionAmount)
                    } else if (reservoirPSI < (linePSI - 2)) { //the -2 is because once the line is 2psi above the reservoir, the triple valve releases
                        //triple valve RELEASE
                        train.all[trainPosition].prototype.brake.tripleValve = "R";
                        train.all[trainPosition].prototype.brake.release(trainPosition);
                        log.Sim.brakes("Element " + trainPosition + ": Triple Valve RELEASE");
                        toast.brakeNotification("Releasing brakes on #" + trainPosition);

                    } else if (reservoirPSI == linePSI) {
                        //triple valve LAP
                        train.all[trainPosition].prototype.brake.tripleValve = "L";
                        log.Sim.brakes("Element " + trainPosition + ": Triple Valve LAP")
                        toast.brakeNotification("Lapping brakes on #" + trainPosition);
                    }
                },
                //calculates the force based on the psi in the brake cylinder
                calcForce: function(trainPosition, psi) {
                    /*
                    This "Magic Number" variable is an interesting concept. It's essentially an approximate constant for converting from pressure in the cylinders to brake force at the wheels. I found it by looking at a study on "brake ratio" for loaded vs empty cars. Brake ratio is a ratio of the braking force to the car's weight, and Load/Empty Sensors (explained on Al Krug's page) adjust the brake system to modify this ratio to avoid slipping when the car is not loaded. I basically took data from this study (which included 4 similar 1970s steel hoppers) and used my knowledge of the cylinder pressure during the tests, and algebra-ed my way to a constant for converting cylinder pressure to braking force. I did it for each car and then averaged the factors together (they didn't differ much) and got 404.
                    
                    Whether the above method is totally accurate is not conclusively proven, but it's a heck of a lot easier than the alternative and it SEEMS mathematically sound, so I'm trying it for now. Results so far seem to indicate that 404 may be a little high.
                    */
                    var magicNumber = 350;
                    train.all[trainPosition].prototype.brake.brakingForce = psi * magicNumber * -1; //multiply by -1 since it's against the trainn's motive force
                    if (train.total.accel.speed.mph == 0) {
                        train.all[trainPosition].prototype.brake.brakingForce = 0;
                        return 0;
                    }
                    return train.all[trainPosition].prototype.brake.brakingForce;
                },
                reservoirPSI: 90, //reservoir psi
                cylinderPSI: 0, //brake cylinder psi
                linePSI: 90, //brake pipe psi
                tripleValve: "R", //can be "R"elease,  "A"pply, or "L"ap
                waitingOnChange: false,
                applicationRate: 0.5, //in psi/sec FROM RESERVOIR
                waitingOnApplication: false, //this is true when the $.animate() routine runs for this element
                brakingForce: 0, //linear braking force acting on the railcar, in lbs
                chargeRate: 0.0001, //psi per millisecond when charging. Should be a really tiny number
                releaseRate: 0.001, //psi per millisecond rate of release. Should be tiny, but larger than the charge rate
            },
            coeff: {
                rollingResistance: 0.009, //rolling resistance
            },
            tmp: { //junk for intervals and such to use as storage
            }
        }
    }
}