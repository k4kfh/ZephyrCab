/*
This file is to keep the new braking code separate, at least until it's stable enough to move over into sim.js
*/

brake = {
    feedValvePSI: 90, //this seems to be the norm
    eqReservoirPSI: 90, //set both of these to the same thing ^^^
    //changing the feed valve resets the brake system to fully charged and 0% braking
    charge :  function() {
        console.log("Stopping sim to reset brake system...")
        sim.stop(); //pause the sim while we do this to keep it from screwing with the physics
        for (var i=0; i<train.all.length;i++) {
            var car = train.all[i].prototype;
            //first set the equalizing reservoir
            brake.eqReservoirPSI = brake.feedValvePSI; //set the global equalizing reservoir first
            //set the brake line pressure to feedvalve pressure
            car.brake.linePSI = brake.feedValvePSI;
            //set the aux. reservoir psi
            car.brake.reservoirPSI = brake.feedValvePSI;
            car.brake.tripleValve = "R"; //set the triple valve to "release and charge"
            //set cylinder psi to 0 (meaning no brakes)
            car.brake.cylinderPSI = 0;
            //Run updated force calculation to reflect no braking pressure
            //THIS FUNCTIONALITY NOT IMPLEMENTED YET
        }
        console.log("Starting sim after brake reset...");
        sim.start(100); //TODO, some kind of a setting
        console.log("Reset Brake System | Feed Valve: " + brake.feedValvePSI + "psi");
        Materialize.toast("Reset Brake System | Feed Valve: " + brake.feedValvePSI + "psi", 3000);
    },
    //sends a signal down the brake pipe and recalculates pressure
    propagate : function(speed) {
        
    },
    //finds the equalization pressure AND full service brake application for a brake pipe with feed valve set at ARG psi
    findEQpressure : function(psi) {
        /*
        Read more about equalization pressure here: http://alkrugsite.evilgeniustech.com/rrfacts/brakes.htm
        
        Algebra behind this function:
        Since a brake reservoir is 2.5 times the size of a brake cylinder, we can set up a problem to find the equalization pressure like this (for a 90psi brake pipe):
        
        90 - x  = 2.5x
        
        This can be rearranged to:
        
        90 = 3.5x
        
        x is the full service brake REDUCTION. To find the equalizing pressure, subtract x from the pipe pressure. So for this,
        
        x = 26
        
        90 - 26 = 64psi
        
        So for a 90psi brake pipe, you can only make up to a 26psi reduction. At that reduction, the brake pipe pressure, reservoir pressure, and cylinder pressure equalize, so you can't move any more air without releasing the brakes.
        
        This function is a programming implementation of that same math.
        */
        var fullServiceReduction = psi/3.5;
        var EQpressure = psi - fullServiceReduction;
        
        var output = {
            EQpressure : EQpressure,
            fullServiceReduction : fullServiceReduction,
        }
        return output;
    },
    //change the brake pipe pressure, 
    propagate : function(newPressure) {
        var baseTime = 0;
        
    },
    //Send an emergency brake signal, which travels faster than the normal signals
    emergency : function() {
        
    },
    //Called from sim.js with ARG car representing the element of the train to parse
    cycle : function(carNumber) {
        /*
        Braking Cycle
        -- Steps --
        - Check the element before us's linePSI property, and see if theirs is different than ours
        - If no difference, do nothing. If difference, 
        
        */
        
        // IF this isn't the first car and it hasn't already been set up with a setTimeout
        if ((carNumber != 0) && (train.all[carNumber].prototype.brake.waitingOnChange == false)) {
            var frontNeighbor = train.all[(carNumber - 1)]; //represents the car in front of us (or locomotive in  front of us)
            var car = train.all[carNumber]; //represents the car specified in the car argument
            //Check to see if frontNeighbor has a different pipe pressure than us
            //console.debug("frontNeighbor number = " + (carNumber - 1))
            if (frontNeighbor.prototype.brake.linePSI != car.prototype.brake.linePSI) {
                //if there is a pressure difference, setTimeout for when we should change this car's PSI
                var timeToWait = car.prototype.brake.latency; //the time it takes for the car to propagate the signal
                car.prototype.tmp.brakePSIchangeTimeout = setTimeout(function() {
                    //code to run after the proper time has elapsed
                    Materialize.toast("Changing linePSI on " + carNumber + " to " + frontNeighbor.prototype.brake.linePSI, 2000);
                    car.prototype.brake.linePSI = frontNeighbor.prototype.brake.linePSI;
                    car.prototype.brake.waitingOnChange = false;
                }, timeToWait)
                car.prototype.brake.waitingOnChange = true; //this variable gets set to false once  the psi finished propagating
                // WIP car.prototype.tmp.brakeApplicationInterval = setInterval(function())
            }
        }
        else if (carNumber == 0) {
            //special version  of this cycle for the leading element, which is always assumed to be a locomotive
            var eqReservoirPSI = brake.eqReservoirPSI; //find the psi of the equalizing reservoir
            var linePSI = train.all[0].prototype.brake.linePSI; //find train brake line PSI
            var waitingOnChange = train.all[0].prototype.brake.waitingOnChange; //this lets us know whether or not any differences in pressure have already been dealt with
            if ((eqReservoirPSI != linePSI) || (waitingOnChange == false)) {
                train.all[0].prototype.brake.linePSI = eqReservoirPSI; //Is this realistic enough? Not sure.
            }
        }
    },
    //called by the train builder whenever a new car is added to fix the pressure on it
    fixNewElement : function(elNumber) {
        //pause the sim
        console.log("Pausing sim to set up new brakes on element " + elNumber + "...")
        sim.stop();
        //set the reservoirPSI
        train.all[elNumber].prototype.brake.linePSI = brake.eqReservoirPSI //set to the equalizing reservoir PSI just to be easy and simple
        train.all[elNumber].prototype.brake.reservoirPSI = brake.eqReservoirPSI //same as above
        //cylinder psi should already be zero on a fresh element, so no need to set that
        console.log("Completed brake setup for element " + elNumber + ". Restarting sim...");
        sim.start();
    }
}
