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
        
    }
}
