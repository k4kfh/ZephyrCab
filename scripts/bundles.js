/*
    ZephyrCab - Realistic Model Train Simulation/Control System
    Copyright (C) 2017 Hampton Morgan (K4KFH)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
BUNDLES

This file is rather special. It bundles locomotive prototype entries and model entries to an entry in the JMRI roster.

It is done using objects, but the syntax is very specific. You must adhere to this syntax or things will explode in fiery infernos.
*/

//code for populating bundles.locomotives with objects
bundles.tools = new Object();
bundles.locomotives = new Object();
bundles.tools.requiredFunctionsTemplate = {
    type: "locomotive",
    model: {
        speed: function(mph, trainPosition) {
            var speedSteps = mph / train.all[trainPosition].prototype.scaleSpeedCoefficient;
            return (speedSteps / 126);
        }
    },
    prototype: {
        calc: {
            te: function(speed, trainPosition, overrideMaxSpeedForAmperage) {
                if (overrideMaxSpeedForAmperage == undefined) {
                    overrideMaxSpeedForAmperage = false;
                }
                var efficiency = train.all[trainPosition].prototype.drivetrainEfficiency;
                var horsepower = train.all[trainPosition].prototype.maxHP * (notch.state / 8)
                train.all[trainPosition].prototype.realtime.horsepower = horsepower;
                var speedSI = speed * 1.60934
                var startingTe = train.all[trainPosition].prototype.startingTE
                var teNewtons = 2650 * ((efficiency * horsepower) / (speedSI))

                train.all[trainPosition].prototype.calc.maxSpeed(trainPosition);
                var teLbs = 0.224809 * teNewtons * reverser * train.all[trainPosition].prototype.realtime.exceedingMaxSpeed;
                if (overrideMaxSpeedForAmperage) {
                    var teLbs = 0.224809 * teNewtons
                }
                if (speed < 8.9 && overrideMaxSpeedForAmperage !== true) {
                    teLbs = startingTe * (notch.state / 8) * reverser * train.all[trainPosition].prototype.realtime.exceedingMaxSpeed;
                } else if (speed < 8.9 && overrideMaxSpeedForAmperage) {
                    teLbs = startingTe * (notch.state / 8)
                }


                return teLbs;
            },
            maxSpeed: function(trainPosition) {
                var speedPerNotch = 7.5;
                var maxSpeed = speedPerNotch * notch.state;
                var actualSpeed = Math.abs(train.total.accel.speed.mph)
                log.sim("Actual Speed: " + actualSpeed)
                if (actualSpeed > maxSpeed) {
                    train.all[trainPosition].prototype.realtime.exceedingMaxSpeed = 0;
                } else {
                    train.all[trainPosition].prototype.realtime.exceedingMaxSpeed = 1;
                }
            },
            amps: function(trainPosition) {
                var maxAmps = train.all[trainPosition].prototype.maxAmps;
                var maxTE = train.all[trainPosition].prototype.startingTE;
                var speed = train.total.accel.speed.mph;
                var currentTE = train.all[trainPosition].prototype.calc.te(speed, trainPosition, true);
                train.all[trainPosition].prototype.realtime.amps = (currentTE / maxTE) * maxAmps;
            }
        },

        wheelSlip: {
            internalForces: 0,
            externalForces: 0,
            slipping: false,
            calcInternalForces: function(trainPosition) {
                train.all[trainPosition].prototype.wheelSlip.internalForces = train.all[trainPosition].prototype.realtime.teIgnoreSlip + train.all[trainPosition].prototype.brake.brakingForce; //store em in a variable and return it too
                return train.all[trainPosition].prototype.wheelSlip.internalForces;
            },
            calcExternalForces: function(trainPosition) {
                var extForces = Math.abs(train.total.netForce - train.all[trainPosition].prototype.realtime.netForceIgnoreSlip);
                log.Sim.wheelslip("Local Net Force = " + train.all[trainPosition].prototype.realtime.netForceIgnoreSlip)
                train.all[trainPosition].prototype.wheelSlip.externalForces = extForces;
                return extForces;
            },
            slipCalc: function(trainPosition) {
                var el = train.all[trainPosition].prototype;
                var threshold;
                if (el.wheelSlip.slipping) {
                    threshold = el.weight * el.wheelSlip.adhesionDuringSlip;
                } else {
                    threshold = el.weight * el.wheelSlip.adhesion;
                }
                log.Sim.wheelslip("---------")
                log.Sim.wheelslip("Threshold = " + threshold);

                var loadOnWheels = el.wheelSlip.calcInternalForces(trainPosition) + el.wheelSlip.calcExternalForces(trainPosition);
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

        air:
        {
            reservoir: {
                main: {
                    currentAtmAirVolume: 6316.307,
                    psi: {
                        g: 0,
                        abs: 14.696,
                    },
                },
            },
            compressor: {
               
                running: 0,
                calcFlow: function(trainPosition) {
                    var rpm = train.all[trainPosition].prototype.realtime.rpm
                    var cfm = rpm * 0.283;

                    return cfm;
                },
            },
        },

        realtime: {
            netForceIgnoreSlip: 0,
            netForce: 0,
            speed: 0,
            rollingResistance: 0,
            exceedingMaxSpeed: 1, 
            horsepower: 0,
            te: 0,
            teIgnoreSlip: 0,
        },

        brake: {
            ind: {
                
                calcForce: function(trainPosition, refPSI) {
                    train.all[trainPosition].prototype.brake.cylinderPSI = indBrake.effectiveIndPSI; 
                    if (train.total.accel.speed.mph == 0) {
                        train.all[trainPosition].prototype.brake.brakingForce = 0;
                        return 0;
                    }
                    train.all[trainPosition].prototype.brake.brakingForce = indBrake.effectiveIndPSI * 350 * -1 * sim.direction;
                    return train.all[trainPosition].prototype.brake.brakingForce;
                }
            },
            reservoirPSI: 90,
            cylinderPSI: 0,
            linePSI: 90,
        },
    },
};

bundles.tools.load = function(){
    var tmp; //each file stores all its data inside var tmp, so we scope it here so it doesn't become a global mess
    bundles.files.forEach(function(filename) {
        log.bundles("Trying to load bundle " + filename)
        $.get("/cfg/bundles/" + filename, function(rawdata, status){
            data = new Object();
            data.unvalidated = eval(rawdata)
            data.validated;
            var name = Object.keys(data.unvalidated)[0]; //ugly, but functional without requiring a massive code restructure
            
            //TODO: DATA VALIDATION HERE
            //Need to make sure all the necessary functions exist, and if not insert the default
            
            //make sure we put our newfound data in the right spot
            if (data.unvalidated[name].type == "locomotive") {
                //DATA VALIDATION
                if (data.unvalidated[name].prototype.calc != undefined) {
                    //if the bundle includes all the functions in it already, do nothing
                    data.validated = data.unvalidated;
                }
                else {
                    log.bundles("Merging in default functions for bundle " + filename)
                    data.validated = {};
                    data.validated[name] = $.extend(true, data.unvalidated[name], bundles.tools.requiredFunctionsTemplate);
                }
                bundles.locomotives[name] = data.validated[name];
            }
            else if (data.unvalidated[name].type == "rollingstock") {
                bundles.rollingstock[name] = data.unvalidated[name];
            }
        })
        bundles.tools.onLoad();
    });
}

//run all the stuff we gotta run after we load all the bundles
bundles.tools.onLoad = function(){
    train.ui.setup();
    train.ui.update();
}


//Rolling Stock - NOT currently tied to the JMRI Roster
bundles.rollingstock = {
    //this is a built in bundle
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
