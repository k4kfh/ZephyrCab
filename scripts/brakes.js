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
This file is to keep the new braking code separate, at least until it's stable enough to move over into sim.js
*/

/*global brake:true, console*/
brake = {
    feedValvePSI: 90, //this seems to be the norm
    eqReservoirPSI: 90, //set both of these to the same thing ^^^
    //changing the feed valve resets the brake system to fully charged and 0% braking
    charge :  function () {
        log.Sim.brakes("Stopping sim to reset brake system...");
        sim.stop(); //pause the sim while we do this to keep it from screwing with the physics
        for (var i=0; i < train.all.length; i++) {
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
        log.Sim.brakes("Starting sim after brake reset...");
        sim.start(100); //TODO, some kind of a setting
        log.Sim.brakes("Reset Brake System | Feed Valve: " + brake.feedValvePSI + "psi");
        Materialize.toast("Reset Brake System | Feed Valve: " + brake.feedValvePSI + "psi", 3000);
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
        var fullServiceReduction = Math.round(psi/3.5);
        var EQpressure = Math.round(psi - fullServiceReduction);
        
        var output = {
            EQpressure : EQpressure,
            fullServiceReduction : fullServiceReduction,
        }
        return output;
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
            //log.Sim.brakes("frontNeighbor number = " + (carNumber - 1))
            if (frontNeighbor.prototype.brake.linePSI != car.prototype.brake.linePSI) {
                //if there is a pressure difference, setTimeout for when we should change this car's PSI
                var timeToWait = car.prototype.brake.latency; //the time it takes for the car to propagate the signal
                car.prototype.tmp.brakePSIchangeTimeout = setTimeout(function() {
                    //code to run after the proper time has elapsed
                    log.Sim.brakes("Changing linePSI on " + carNumber + " to " + frontNeighbor.prototype.brake.linePSI, 2000);
                    car.prototype.brake.linePSI = frontNeighbor.prototype.brake.linePSI;
                    car.prototype.brake.waitingOnChange = false;
                    //now we change the triple valve state
                    car.prototype.brake.tripleValveCycle(carNumber);
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
        log.Sim.brakes("Pausing sim to set up new brakes on element " + elNumber + "...")
        sim.stop();
        //set the reservoirPSI
        train.all[elNumber].prototype.brake.linePSI = brake.eqReservoirPSI //set to the equalizing reservoir PSI just to be easy and simple
        train.all[elNumber].prototype.brake.reservoirPSI = brake.eqReservoirPSI //same as above
        //cylinder psi should already be zero on a fresh element, so no need to set that
        log.Sim.brakes("Completed brake setup for element " + elNumber + ". Restarting sim...");
        sim.start();
    },
    //when called, takes the average of all the localized brake pipe pressures and combines them into one average, which will show on the engineer's gauge.
    avgLinePSI : function() {
        var totalPSI = 0;
        for (var elNumber = 0; elNumber < train.all.length; elNumber++) {
            var linePSI = train.all[elNumber].prototype.brake.linePSI;
            totalPSI = totalPSI + linePSI;
        }
        var avg = totalPSI / train.all.length; //divide the sum of the pressures by the number of the cars
        return avg;
    },
}

indBrake = {
    indValvePSI:0, //the PSI the independent brake valve wants it to be
    lastBailOffPSI:brake.feedValvePSI, //train brake pipe psi at the last time the bailoff button was pressed
    effectiveAutoBrakePSI:0, //how much the automatic brake has increased (if at all) since the last bail off
    effectiveIndPSI:0, //the actual PSI in the reference pipe, determined by favoring the independent or automatic brake valve
    maxPressure:undefined, //the maximum amount we can apply the ind. brake. See indBrake.calcMaxPressure() for more info
    bailOff: function(){
        indBrake.lastBailOffPSI = brake.eqReservoirPSI; //remember the PSI we bail off at
        indBrake.calcEffIndPSI(); //run this to calculate the new pressure
    },
    calcEffAutoBrakePSI: function() {
        //if the automatic brake has been released recently
        if ((indBrake.lastBailOffPSI - brake.eqReservoirPSI) <= 0) {
            //say the last time we bailed off was 70psi, then we released. 70-90=-20, but our effective autobrake PSI would be 0
            indBrake.effectiveAutoBrakePSI = 0;
        }
        //the normal math
        else {
            indBrake.effectiveAutoBrakePSI = indBrake.lastBailOffPSI - brake.eqReservoirPSI; //otherwise we calculate it the normal way
            // for example, last bailed off at 80, we drop to 70psi. 80psi - 70psi = 10psi effective brake pressure.
        }
        
        return indBrake.effectiveAutoBrakePSI;
    },
    calcEffIndPSI: function() {
        //make sure the values we're about to use are up to date by calling this
        indBrake.calcEffAutoBrakePSI();
        //figure out which brake pressure is greater and favor it
        var indBrakePSI = indBrake.indValvePSI;
        var autoBrakePSI = indBrake.effectiveAutoBrakePSI;
        if (indBrakePSI < autoBrakePSI) {
            log.Sim.brakes("indBrake: Favoring automatic brake for independent brake pressure; "+ autoBrakePSI + "PSI")
            indBrake.effectiveIndPSI = Number(autoBrakePSI);
            //now we let the user know a bailoff is possible
            ui.bailoff.set(true);
        }
        else {
            log.Sim.brakes("indBrake: Favoring independent brake valve for independent brake pressure; "+ indBrakePSI + "PSI")
            indBrake.effectiveIndPSI = indBrakePSI;
            //now we let the user know a bailoff will have no immediate effect since the ind. brake valve is favored
            ui.bailoff.set(false)
        }
        return indBrake.effectiveIndPSI;
    },
    calcMaxPressure: function(){
        //there's a 250% pressure increase in the automatic brake system. ie 10lb reduction = 25lb cylinder pressure
        var maxPressure = 2.5 * brake.findEQpressure(brake.feedValvePSI).fullServiceReduction; //we find the max pressure we can remove from the auto brake then multiply that by 2.5 to get the right pressure for this (since ind. brake is a straight air brake instead of the Westinghouse voodoo)
        indBrake.maxPressure = maxPressure;
        return maxPressure;
    }
}
