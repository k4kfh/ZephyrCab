/*
This file is to keep the new braking code separate, at least until it's stable enough to move over into sim.js
*/

brake = {
    feedValvePSI: 90, //this seems to be the norm
    eqReservoirPSI: 90, //set both of these to the same thing ^^^
    charge :  function() {
        
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
            }
        }
        else if (carNumber == 0) {
            //special version  of this cycle for the leading element; WIP
        }
    }
}
