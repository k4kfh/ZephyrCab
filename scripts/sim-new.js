//This is a really ugly temporary file to hold a quick rough draft of a new sim.accel function

sim.accel = function() {
    //make sure the train actually has elements
    if (train.all.length !== 0) {
        for (var i = 0; i < train.all.length; i++) {
            if (train.all[i].type === 'locomotive') {
                //Locomotive Specific Stuff

                /*
                If the engine is running:
                - Calculate RPM and tractive effort
                - Figure out notching sounds on applicable decoders
                - Figure out fuel usage
                - Subtract fuel usage for this cycle
                - Stop the engine if it runs out of fuel, and notify the engineer
                - Start or stop the air compressor depending on reservoir pressure

                If the engine is not running, move on to the ELSE statement.
                */
                if (train.all[i].prototype.engineRunning === 1) {
                    //Calculates the engine RPM
                    train.all[i].prototype.realtime.rpm = train.all[i].prototype.engineRunning * train.all[i].prototype.notchRPM[notch.state];

                    //Checks if the train is exceeding its max speed for this notch
                    if (train.all[i].prototype.exceedingMaxSpeed === 1) {
                        //If not, we find the tractive effort
                        train.all[i].prototype.realtime.te = train.all[i].prototype.calc.te(train.total.accel.speed.mph, i);
                    } else {
                        //If it is exceeding its max speed, set tractive effort to 0
                        train.all[i].prototype.realtime.te = 0;
                    }

                    //Grab fuel usage in gallons/hr for this notch
                    var fuelUsagePerHour = train.all[i].prototype.fuel.usage[notch.state];
                    //Set usage per hour variable
                    train.all[i].prototype.realtime.fuelUsagePerHour = fuelUsagePerHour;
                    //Set usage per cycle variable, which by default is gallons per 100ms.
                    train.all[i].prototype.realtime.fuel.usagePerCycle = (fuelUsage / (36000)) * sim.time.speed; //The 36,000 is the conversion factor for hours to 100ms increments

                    //Subtract the fuel usage we just calculated from  the current fuel tank
                    train.all[i].prototype.realtime.fuel.status =- train.all[i].prototype.realtime.fuel.usagePerCycle;
                    //Make sure the above calculation isn't less than 0
                    if (train.all[i].prototype.realtime.fuel.status < 0) {
                        train.all[i].prototype.realtime.fuel.status = 0;
                    }

                    //TODO - Add fuel gauge and update it here

                    //Stop the engine if it runs out of fuel, and alert the user
                    if (train.all[i].prototype.realtime.fuel.status === 0) {
                        train.all[i].dcc.f.engine.set(false); //Turn off engine sounds, which sets running to 0, making the TE of this loco nothing
                        //This if statement checks if we've already notified the user, and if we haven't, it does.
                        if (train.all[i].prototype.realtime.fuel.notifiedOfEmptyTank === false) {
                            Materialize.toast("<i class='material-icons left'>warning</i>" + train.all[i].roster.name + " has run out of fuel!")
                            train.all[i].prototype.realtime.fuel.notifiedOfEmptyTank = true;
                        }
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
                    var compressor = train.all[i].prototype.realtime.compressor,
                        dumpValve = train.all[i].prototype.realtime.air.reservoir.main.dump,
                        upperLimit = train.all[i].prototype.air.compressor.limits.upper,
                        lowerLimit = train.all[i].prototype.air.compressor.limits.lower,
                        psi = train.all[i].prototype.realtime.air.reservoir.main.psi.g,
                        cfmRpmRatio = train.all[i].prototype.air.compressor.flowrate, //ratio of cfm per rpm
                        rpm = train.all[i].prototype.realtime.rpm;
                    //Check if dump valve is open or closed
                    if (dumpValve == false) {
                        //If pressure is too low, start compressor
                        if (psi < lowerLimit) {
                            //Turn on compressor
                            compressor.running = 1;
                        }
                        //If pressure is too high, stop compressor
                        else if (psi > upperLimit) {
                            //Turn off compressor
                            compressor.running = 0;
                            //Set flow rate to 0cfm

                        }
                    }
                    //If dump valve is open, make sure compressor is off
                    else {
                        compressor.running = 0;
                    }

                } else {
                    /*
                    If the engine is NOT running:
                    - Set RPM and Tractive Effort to 0
                    - Don't do anything with notching sounds
                    - Set fuel consumption to 0
                    - Stop the air compressor
                    */
                    train.all[i].prototype.realtime.rpm = 0;
                    train.all[i].prototype.realtime.te = 0;
                    //Set fuel consumption to zero
                    train.all[i].prototype.realtime.fuel.usagePerCycle = 0;
                    //Turn off air compressor sound
                    train.all[i].dcc.f.compressor.set(false);
                    //Turn off air compressor simulation
                    train.all[i].prototype.realtime.air.compressor.running = 0;
                }


            } else if (train.all[i].type === 'rollingstock') {
                //Rolling Stock Specific Stuff
            }
        }
    }
}